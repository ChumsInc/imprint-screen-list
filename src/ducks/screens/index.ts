import {combineReducers} from 'redux'
import {ActionInterface} from 'chums-ducks/dist/ducks/types';
import {SorterProps} from "../types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export interface ScreenAction extends ActionInterface {
    payload?: {
        list?: Screen[],
        selected?: Screen,
        change?: object,
        error?: Error,
        context?: string,
        filter?: string,
    }
}

export interface ScreenThunkAction  extends ThunkAction<any, RootState, unknown, ScreenAction> {}


export interface Screen {
    id: number,
    screenId: number,
    title: string,
    twoSided: boolean,
    active: boolean,
    timestamp: string,
    changed?: boolean,
}

export type ScreenSortField = keyof Screen;

export interface ScreenState {
    list: Screen[],
    selected: Screen,
    loading: boolean,
    loadingSelected: boolean,
    filter: string,
    showInactive: boolean,
}

export const defaultScreen: Screen = {
    id: 0,
    screenId: 0,
    title: '',
    twoSided: false,
    active: true,
    timestamp: '',
    changed: false,
}

const defaultState: ScreenState = {
    list: [],
    selected: {...defaultScreen},
    loading: false,
    loadingSelected: false,
    filter: '',
    showInactive: false,
}

export interface ScreenSorterProps extends SorterProps {
    field: ScreenSortField,
}

const defaultSort: ScreenSorterProps = {field: 'title', ascending: true};

export const loadScreensRequested = 'screens/loadRequested';
export const loadScreensSucceeded = 'screens/loadSucceeded';
export const loadScreensFailed = 'screens/loadFailed';
export const loadScreenEntryRequested = 'screens/loadEntryRequested';
export const loadScreenEntrySucceeded = 'screens/loadEntrySucceeded';
export const loadScreenEntryFailed = 'screens/loadEntryFailed';
export const saveScreenEntryRequested = 'screens/saveEntryRequested';
export const saveScreenEntrySucceeded = 'screens/saveEntrySucceeded';
export const saveScreenEntryFailed = 'screens/saveEntryFailed';
export const deleteScreenEntryRequested = 'screens/deleteEntryRequested';
export const deleteScreenEntrySucceeded = 'screens/deleteEntrySucceeded';
export const deleteScreenEntryFailed = 'screens/deleteEntryFailed';
export const screenEntrySelected = 'screens/entrySelected';
export const screenEntryChanged = 'screens/entryChanged';
export const screenFilterChanged = 'screens/filterChanged';
export const screenInactiveFilterToggled = 'screens/inactiveFilterToggled';


export const listURL = '/api/operations/imprint/screens/:screenId(\\d+)?';
export const saveURL = '/api/operations/imprint/screens/:screenId(\\d+)/:id(\\d+)?';
export const statusURL = '/api/operations/imprint/screens/:screenId(\\d+)/status/:active(1|0)';
export const deleteEntryURL = '/api/operations/imprint/screens/:screenId(\\d+)/:id(\\d+)';


export const screenSorter = ({field, ascending}:ScreenSorterProps) => (a:Screen, b:Screen) => {
    return (
        a[field] === b[field]
            ? (a.id > b.id ? 1 : -1)
            : ((a[field]??'') === (b[field]??'') ? 0 :((a[field]??'') > (b[field]??'') ? 1 : -1))
    ) * (ascending ? 1 : -1);
}


export const screenListSelector = (sort:ScreenSorterProps) => (state: RootState):Screen[] => {
    const {showInactive, filter, list} = state.screens;
    let filterRegex = /^/;
    let filterIDRegex = /^/;
    try {
        filterRegex = new RegExp(filter, 'i');
        filterIDRegex = new RegExp(`^${filter}$`)
    } catch (err) {
    }

    return list.filter(screen => showInactive || screen.active)
        .filter(screen => !filter
            || filterRegex.test(screen.title)
            || filterIDRegex.test(String(screen.id))
            || filterIDRegex.test(String(screen.screenId))
        )
        .sort(screenSorter(sort));
}
export const screenListByScreenIDSelector = (screenId: number, sort:ScreenSorterProps) =>
    (state: RootState):Screen[] => {
        const {showInactive, list} = state.screens;
        return list
            .filter(screen => screen.screenId === screenId)
            .filter(screen => showInactive || screen.active)
            .sort(screenSorter(sort));
    }

export const screenEntryByIdSelector = (id:number) => (state:RootState):Screen => {
    const [entry] = state.screens.list.filter(screen => screen.id === id);
    return entry;
}

export const screenLoadingSelector = (state:RootState):boolean => state.screens.loading;
export const screenEntryLoadingSelector = (state:RootState):boolean => state.screens.loadingSelected;
export const selectedScreenSelector = (state:RootState):Screen => state.screens.selected;
export const screenFilterSelector = (state:RootState) => state.screens.filter;
export const showInactiveSelector = (state:RootState) => state.screens.showInactive;
export const selectedScreenListSelector = (state:RootState):Screen[] => state.screens.list.filter(screen => screen.screenId === state.screens.selected.screenId);
export const canRecoverSelector = (state:RootState) => {
    const list = selectedScreenListSelector(state);
    return list.length > 0 && list.filter(screen => screen.active).length === 0;
}
export const canDestroySelector = (state:RootState) => {
    const list = selectedScreenListSelector(state);
    return list.length > 0 && list.filter(screen => screen.active).length > 0;
}


const listReducer = (state: Screen[] = defaultState.list, action: ScreenAction): Screen[] => {
    const {type, payload} = action;
    switch (type) {
    case loadScreensSucceeded:
        if (payload?.list) {
            const list = payload.list;
            return [...list].sort(screenSorter(defaultSort))
        }
        return state;
    case loadScreenEntrySucceeded:
    case deleteScreenEntrySucceeded:
    case saveScreenEntrySucceeded:
        if (payload?.selected) {
            const list = payload?.list || [];
            const screenId = payload.selected.screenId;
            return [
                ...state.filter(s => s.screenId !== screenId),
                ...list,
            ].sort(screenSorter(defaultSort));
        }
        return state;
    default:
        return state;
    }
}

const selectedReducer = (state:Screen = defaultScreen, action: ScreenAction): Screen => {
    const {type, payload} = action;
    switch (type) {
    case screenEntrySelected:
    case loadScreenEntrySucceeded:
    case saveScreenEntrySucceeded:
    case deleteScreenEntrySucceeded:
        return payload?.selected || {...defaultScreen};
    case screenEntryChanged:
        if (payload?.change) {
            return {
                ...state,
                ...payload.change,
                changed: true
            }
        }
        return state;
    default: return state;
    }
}

const loadingReducer = (state:boolean = false, action:ScreenAction): boolean => {
    const {type} = action;
    switch (type) {
    case loadScreensRequested:
        return true;
    case loadScreensSucceeded:
    case loadScreensFailed:
        return false;
    default: return state;
    }
}

const loadingSelectedReducer = (state:boolean = false, action:ScreenAction): boolean => {
    const {type} = action;
    switch (type) {
    case loadScreenEntryRequested:
    case saveScreenEntryRequested:
    case deleteScreenEntryRequested:
        return true;
    case loadScreenEntrySucceeded:
    case loadScreenEntryFailed:
    case saveScreenEntrySucceeded:
    case saveScreenEntryFailed:
    case deleteScreenEntrySucceeded:
    case deleteScreenEntryFailed:
        return false;
    default: return state;
    }
}

const filterReducer = (state:string = defaultState.filter, action:ScreenAction):string => {
    const {type, payload} = action;
    switch (type) {
    case screenFilterChanged:
        return payload?.filter || '';
    default:
        return state;
    }
}

const showInactiveReducer = (state:boolean = defaultState.showInactive, action:ScreenAction):boolean => {
    const {type} = action;
    switch (type) {
    case screenInactiveFilterToggled:
        return !state;
    default: return state;
    }
}
export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loadingSelected: loadingSelectedReducer,
    filter: filterReducer,
    showInactive: showInactiveReducer,
});
