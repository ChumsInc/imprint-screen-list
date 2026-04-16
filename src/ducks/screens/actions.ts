import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ImprintScreen} from "@/ducks/types";
import type {RootState} from "@/app/configureStore";
import {
    delScreenEntry,
    fetchPermissions,
    fetchScreen,
    fetchScreenList,
    postScreenEntry,
    putScreenStatus
} from "@/ducks/screens/api";
import {selectScreenStatus} from "@/ducks/screens/index";

export const loadScreenList = createAsyncThunk<ImprintScreen[], void, { state: RootState }>(
    'screens/list/load',
    async () => {
        return await fetchScreenList();
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return selectScreenStatus(state) === 'idle'
        }
    }
)

export const validateRole = createAsyncThunk<boolean, string, {state:RootState}>(
    'screens/validateRole',
    async (arg) => {
        return await fetchPermissions(arg);
    }
)

export const loadScreensByScreenId = createAsyncThunk<ImprintScreen[], number | string, { state: RootState }>(
    'screens/list/loadByScreenId',
    async (arg) => {
        return await fetchScreen(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return selectScreenStatus(state) === 'idle'
        }
    }
)

export const saveScreenEntry = createAsyncThunk<ImprintScreen[], ImprintScreen, { state: RootState }>(
    'screens/save',
    async (arg) => {
        return await postScreenEntry(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return selectScreenStatus(state) === 'idle'
        }
    }
)

export const deleteEntryScreenEntry = createAsyncThunk<ImprintScreen[], ImprintScreen, { state: RootState }>(
    'screens/deleteEntry',
    async (arg) => {
        return await delScreenEntry(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return arg.id > 0 && selectScreenStatus(state) === 'idle'
        }
    }
)


export const saveScreenStatus = createAsyncThunk<ImprintScreen[], Pick<ImprintScreen, 'screenId' | 'active'>, {
    state: RootState
}>(
    'screens/setStatus',
    async (arg) => {
        return await putScreenStatus(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg.screenId && selectScreenStatus(state) === 'idle';
        }
    }
)
