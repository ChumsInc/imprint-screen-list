import {
    defaultScreen,
    deleteEntryURL,
    deleteScreenEntryFailed,
    deleteScreenEntryRequested,
    deleteScreenEntrySucceeded,
    listURL,
    loadScreenEntryFailed,
    loadScreenEntryRequested,
    loadScreenEntrySucceeded,
    loadScreensFailed,
    loadScreensRequested,
    loadScreensSucceeded,
    saveScreenEntryFailed,
    saveScreenEntryRequested,
    saveScreenEntrySucceeded,
    saveURL,
    Screen,
    ScreenAction,
    screenEntryByIdSelector,
    screenEntryChanged,
    selectCurrentLoading,
    screenEntrySelected,
    screenFilterChanged,
    screenInactiveFilterToggled,
    selectScreensLoading,
    ScreenThunkAction,
    selectCurrentScreen, statusURL
} from "./index";
import {fetchJSON} from "chums-ducks";

export const filterChanged = (filter: string): ScreenAction => ({type: screenFilterChanged, payload: {filter}});
export const toggleShowInactive = (): ScreenAction => ({type: screenInactiveFilterToggled});
export const changeScreenEntry = (change: object): ScreenAction => ({type: screenEntryChanged, payload: {change}});

export const changeScreenCancelled = (): ScreenThunkAction => (dispatch, getState) => {
    const state = getState();
    const selected = selectCurrentScreen(state);
    const screen = screenEntryByIdSelector(selected.id)(state);
    dispatch({type: screenEntrySelected, payload: {selected: screen}});
}

export const newScreenEntry = (): ScreenThunkAction => (dispatch, getState) => {
    const state = getState();
    const selected = selectCurrentScreen(state);
    const newScreen = {...defaultScreen, screenId: selected.screenId};
    dispatch({type: screenEntrySelected, payload: {selected: newScreen}});
}

export const selectScreenEntry = (selected: Screen): ScreenThunkAction => (dispatch) => {
    dispatch({type: screenEntrySelected, payload: {selected}});
    dispatch(loadScreenList(selected.screenId, selected.id));
}

export const loadScreenList = (screenId?: number, id?: number): ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = selectScreensLoading(state) || selectCurrentLoading(state);
        if (loading) {
            return;
        }
        dispatch({type: screenId ? loadScreenEntryRequested : loadScreensRequested, meta: {screenId, id}})
        const url = listURL.replace(':screenId', encodeURIComponent(screenId || ''));
        const {screens} = await fetchJSON(url);
        let selected = screenId ? {...defaultScreen, screenId} : undefined;
        if (id) {
            [selected] = (screens as Screen[]).filter(s => s.id === id);
        }
        dispatch({
            type: screenId ? loadScreenEntrySucceeded : loadScreensSucceeded,
            payload: {list: screens, selected},
            meta: {screenId, id}
        })
    } catch (error:unknown) {
        if (error instanceof Error) {
            return dispatch({
                type: screenId ? loadScreenEntryFailed : loadScreensFailed,
                payload: {error, context: screenId ? loadScreenEntryRequested : loadScreensRequested},
                meta: {screenId, id}
            });
        }
        dispatch({
            type: screenId ? loadScreenEntryFailed : loadScreensFailed,
            meta: {screenId, id}
        })
    }
}

export const saveScreenEntry = (): ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = selectScreensLoading(state) || selectCurrentLoading(state);
        if (loading) {
            return;
        }
        const selected = selectCurrentScreen(state);
        dispatch({type: saveScreenEntryRequested, meta: {screenId: selected.screenId, id: selected.id}});
        const url = saveURL.replace(':screenId', encodeURIComponent(selected.screenId))
            .replace(':id', encodeURIComponent(selected.id || ''));

        const {screens} = await fetchJSON(url, {method: selected.id ? 'put' : 'post', body: JSON.stringify(selected)});
        let newScreen = {...defaultScreen, screenId: selected.screenId};
        dispatch({type: saveScreenEntrySucceeded, payload: {list: screens, selected: newScreen}})
    } catch (error:unknown) {
        if (error instanceof Error) {
            console.warn("()", error.message);
            return dispatch({type: saveScreenEntryFailed, payload: {error, context: saveScreenEntryRequested}});
        }
        dispatch({type: saveScreenEntryFailed})
    }
}

export const deleteScreenEntry = (): ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = selectScreensLoading(state) || selectCurrentLoading(state);
        if (loading) {
            return;
        }
        const selected = selectCurrentScreen(state);
        if (!selected.id || !selected.screenId) {
            return;
        }
        dispatch({type: deleteScreenEntryRequested, meta: {screenId: selected.screenId, id: selected.id}});
        const url = deleteEntryURL.replace(':screenId', encodeURIComponent(selected.screenId))
            .replace(':id', encodeURIComponent(selected.id));
        // const url = buildPath(deleteEntryURL, {screenId: selected.screenId, id: selected.id});
        const {screens} = await fetchJSON(url, {method: 'delete'});
        const newScreen = {...defaultScreen, screenId: selected.screenId}
        dispatch({type: deleteScreenEntrySucceeded, payload: {list: screens, selected: newScreen}})
    } catch (error:unknown) {
        if (error instanceof Error) {
            console.warn("()", error.message);
            return dispatch({type: deleteScreenEntryFailed, payload: {error, context: deleteScreenEntryRequested}});
        }
        dispatch({type: deleteScreenEntryFailed})
    }
}

export const saveScreenStatus = (status: boolean): ScreenThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectScreensLoading(state) || selectCurrentLoading(state);
            if (loading) {
                return;
            }
            const selected = selectCurrentScreen(state);
            if (!selected.screenId) {
                return;
            }
            const url = statusURL.replace(':screenId', encodeURIComponent(selected.screenId))
                .replace(':active', encodeURIComponent(status ? 1 : 0));
            const {screens} = await fetchJSON(url, {method: 'put'});
            let newScreen = {...defaultScreen, screenId: selected.screenId}
            if (selected.id) {
                [newScreen] = (screens as Screen[]).filter(screen => screen.id === selected.id);
            }
            dispatch({type: deleteScreenEntrySucceeded, payload: {list: screens, selected: newScreen}})
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("()", error.message);
                return dispatch({type: deleteScreenEntryFailed, payload: {error, context: deleteScreenEntryRequested}});
            }
            dispatch({type: deleteScreenEntryFailed});
        }
    }
