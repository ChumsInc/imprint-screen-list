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
    screenEntryLoadingSelector,
    screenEntrySelected,
    screenFilterChanged,
    screenInactiveFilterToggled,
    screenLoadingSelector,
    ScreenThunkAction,
    selectedScreenSelector, statusURL
} from "./index";
import {buildPath, fetchGET, fetchPOST} from "../../fetch";

export const filterChanged = (filter: string): ScreenAction => ({type: screenFilterChanged, payload: {filter}});
export const toggleShowInactive = (): ScreenAction => ({type: screenInactiveFilterToggled});
export const changeScreenEntry = (change: object): ScreenAction => ({type: screenEntryChanged, payload: {change}});

export const changeScreenCancelled = (): ScreenThunkAction => (dispatch, getState) => {
    const state = getState();
    const selected = selectedScreenSelector(state);
    const screen = screenEntryByIdSelector(selected.id)(state);
    dispatch({type: screenEntrySelected, payload: {selected: screen}});
}

export const newScreenEntry = (): ScreenThunkAction => (dispatch, getState) => {
    const state = getState();
    const selected = selectedScreenSelector(state);
    const newScreen = {...defaultScreen, screenId: selected.screenId};
    dispatch({type: screenEntrySelected, payload: {selected: newScreen}});
}

export const selectScreenEntry = (selected: Screen): ScreenThunkAction => (dispatch, getState) => {
    dispatch({type: screenEntrySelected, payload: {selected}});
    dispatch(loadScreenList(selected.screenId, selected.id));
}

export const loadScreenList = (screenId?: number, id?: number): ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = screenLoadingSelector(state) || screenEntryLoadingSelector(state);
        if (loading) {
            return;
        }
        dispatch({type: screenId ? loadScreenEntryRequested : loadScreensRequested, meta: {screenId, id}})
        const url = buildPath(listURL, {screenId: screenId});
        const {screens} = await fetchGET(url);
        let selected = screenId ? {...defaultScreen, screenId} : undefined;
        if (id) {
            [selected] = (screens as Screen[]).filter(s => s.id === id);
        }
        dispatch({
            type: screenId ? loadScreenEntrySucceeded : loadScreensSucceeded,
            payload: {list: screens, selected},
            meta: {screenId, id}
        })
    } catch (err) {
        console.warn("()", err.message);
        dispatch({
            type: screenId ? loadScreenEntryFailed : loadScreensFailed,
            payload: {error: err, context: screenId ? loadScreenEntryRequested : loadScreensRequested},
            meta: {screenId, id}
        })
    }
}

export const saveScreenEntry = (): ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = screenLoadingSelector(state) || screenEntryLoadingSelector(state);
        if (loading) {
            return;
        }
        const selected = selectedScreenSelector(state);
        dispatch({type: saveScreenEntryRequested, meta: {screenId: selected.screenId, id: selected.id}});
        const url = buildPath(saveURL, {screenId: selected.screenId, id: selected.id || undefined});
        const {screens} = await fetchPOST(url, selected, {method: selected.id ? 'put' : 'post'});
        let newScreen = {...defaultScreen, screenId: selected.screenId};
        dispatch({type: saveScreenEntrySucceeded, payload: {list: screens, selected: newScreen}})
    } catch (err) {
        console.warn("()", err.message);
        dispatch({type: saveScreenEntryFailed, payload: {error: err, context: saveScreenEntryRequested}});
    }
}

export const deleteScreenEntry = (): ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = screenLoadingSelector(state) || screenEntryLoadingSelector(state);
        if (loading) {
            return;
        }
        const selected = selectedScreenSelector(state);
        if (!selected.id || !selected.screenId) {
            return;
        }
        dispatch({type: deleteScreenEntryRequested, meta: {screenId: selected.screenId, id: selected.id}});
        const url = buildPath(deleteEntryURL, {screenId: selected.screenId, id: selected.id});
        const {screens} = await fetchPOST(url, selected, {method: 'delete'});
        const newScreen = {...defaultScreen, screenId: selected.screenId}
        dispatch({type: deleteScreenEntrySucceeded, payload: {list: screens, selected: newScreen}})
    } catch (err) {
        console.warn("()", err.message);
        dispatch({type: deleteScreenEntryFailed, payload: {error: err, context: deleteScreenEntryRequested}});
    }
}

export const saveScreenStatus = (status: boolean): ScreenThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = screenLoadingSelector(state) || screenEntryLoadingSelector(state);
            if (loading) {
                return;
            }
            const selected = selectedScreenSelector(state);
            if (!selected.screenId) {
                return;
            }
            const url = buildPath(statusURL, {screenId: selected.screenId, active: status ? 1 : 0});
            const {screens} = await fetchGET(url, {method: 'put'});
            let newScreen = {...defaultScreen, screenId: selected.screenId}
            if (selected.id) {
                [newScreen] = (screens as Screen[]).filter(screen => screen.id === selected.id);
            }
            dispatch({type: deleteScreenEntrySucceeded, payload: {list: screens, selected: newScreen}})
        } catch(err) {
            console.log("()", err.message);
            return Promise.reject(err);
        }
    }
