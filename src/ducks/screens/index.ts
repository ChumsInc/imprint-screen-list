import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SortProps} from "chums-types";
import {RootState} from "@/app/configureStore";
import {ImprintScreen} from "@/ducks/types";
import {
    deleteEntryScreenEntry,
    loadScreenList,
    loadScreensByScreenId,
    saveScreenEntry,
    validateRole
} from "@/ducks/screens/actions";
import {screenListSorter} from "@/ducks/screens/utils";


const screensAdapter = createEntityAdapter<ImprintScreen, number>({
    selectId: (screen) => screen.id,
    sortComparer: (a, b) => a.id - b.id,
})

export interface ScreensSliceExtraState {
    status: 'idle' | 'loading' | 'saving' | 'deleting' | 'rejected';
    sort: SortProps<ImprintScreen>;
    screenId: number | null;
    search: string;
    showInactive: boolean;
    canRecover: boolean;
    canDestroy: boolean;
    current: ImprintScreen | null;
    currentListSort: SortProps<ImprintScreen>;
}

const extraState: ScreensSliceExtraState = {
    status: 'idle',
    sort: {field: 'id', ascending: true},
    screenId: null,
    search: '',
    showInactive: false,
    canRecover: false,
    canDestroy: false,
    current: null,
    currentListSort: {field: 'id', ascending: true},
}

const screensSlice = createSlice({
    name: 'screens',
    initialState: screensAdapter.getInitialState(extraState),
    reducers: (create) => ({
        setScreenSort: (state, action: PayloadAction<SortProps<ImprintScreen>>) => {
            state.sort = action.payload;
        },
        setCurrentScreenSort: (state, action: PayloadAction<SortProps<ImprintScreen>>) => {
            state.currentListSort = action.payload;
        },
        setScreenId: (state, action: PayloadAction<number | null>) => {
            state.screenId = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setShowInactive: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        },
        setCurrentScreenItem: (state, action: PayloadAction<ImprintScreen | null>) => {
            state.current = action.payload;
        }
    }),
    extraReducers: (builder) => {
        builder
            .addCase(loadScreenList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadScreenList.fulfilled, (state, action) => {
                state.status = 'idle';
                screensAdapter.setAll(state, action.payload);
            })
            .addCase(loadScreenList.rejected, (state) => {
                state.status = 'rejected'
            })
            .addCase(loadScreensByScreenId.pending, (state, action) => {
                state.status = 'loading';
                state.screenId = action.meta.arg ? +action.meta.arg : null;
            })
            .addCase(loadScreensByScreenId.fulfilled, (state, action) => {
                state.status = 'idle';
                state.screenId = action.meta.arg ? +action.meta.arg : null;
                const existing = Object.values(state.entities)
                    .filter(s => s.screenId === state.screenId)
                    .map(s => s.id);
                screensAdapter.removeMany(state, existing);
                screensAdapter.addMany(state, action.payload);
            })
            .addCase(loadScreensByScreenId.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(saveScreenEntry.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveScreenEntry.fulfilled, (state, action) => {
                state.status = 'idle';
                screensAdapter.upsertMany(state, action.payload);
                const [entry] = action.payload.filter(e => e.id === state.current?.id);
                state.current = entry ?? null;
            })
            .addCase(saveScreenEntry.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(deleteEntryScreenEntry.pending, (state) => {
                state.status = 'deleting';
            })
            .addCase(deleteEntryScreenEntry.fulfilled, (state, action) => {
                state.status = 'idle';
                screensAdapter.removeOne(state, action.meta.arg.id);
                state.current = null;
            })
            .addCase(deleteEntryScreenEntry.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(validateRole.fulfilled, (state, action) => {
                state.canDestroy = action.payload;
                state.canRecover = action.payload;
            })
            .addCase(validateRole.rejected, (state) => {
                state.canDestroy = false;
                state.canRecover = false;
            })
    },
    selectors: {
        selectScreenSort: (state) => state.sort,
        selectScreenId: (state) => state.screenId,
        selectScreenSearch: (state) => state.search,
        selectShowInactive: (state) => state.showInactive,
        selectScreenStatus: (state) => state.status,
        selectCanRecover: (state) => state.canRecover,
        selectCanDestroy: (state) => state.canDestroy,
        selectCurrentScreenEntry: (state) => state.current,
        selectCurrentListSort: (state) => state.currentListSort,
    }
});

export const {
    selectScreenSort,
    selectScreenStatus,
    selectScreenSearch,
    selectScreenId,
    selectShowInactive,
    selectCanRecover,
    selectCanDestroy,
    selectCurrentScreenEntry,
    selectCurrentListSort,
} = screensSlice.selectors;
const screenSelectors = screensAdapter.getSelectors<RootState>(
    (state) => state.screens,
)

export const selectScreensList = screenSelectors.selectAll;
export const selectFilteredScreensList = createSelector(
    [selectScreensList, selectScreenSearch, selectShowInactive, selectScreenSort],
    (list, search, showInactive, sort) => {
        return list.filter(s => !search.trim()
            || s.title.toLowerCase().includes(search.toLowerCase())
            || s.screenId.toString().includes(search.toLowerCase())
        )
            .filter(s => showInactive || s.active)
            .sort(screenListSorter(sort))
    }
)

export const selectCurrentScreenList = createSelector(
    [selectScreensList, selectScreenId, selectCurrentListSort],
    (list, screenId, sort) => {
        if (!screenId) {
            return [];
        }
        return list.filter(screen => screen.screenId === screenId)
            .sort(screenListSorter(sort))
    }
)

export const {
    setScreenSort,
    setSearch,
    setScreenId,
    setShowInactive,
    setCurrentScreenSort,
    setCurrentScreenItem
} = screensSlice.actions;

export default screensSlice;

