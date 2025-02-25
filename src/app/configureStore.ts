import {asyncThunkCreator, buildCreateSlice, configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import alertsReducer from "@/ducks/alerts";
import {setupListeners} from "@reduxjs/toolkit/query/react";
import screensSlice from "@/ducks/screens";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    [screensSlice.reducerPath]: screensSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    })
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const createAppSlice = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})


export default store;
