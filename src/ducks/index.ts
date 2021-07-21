import {sortableTablesReducer, alertsReducer, pagesReducer} from 'chums-ducks/dist/ducks'
import {combineReducers} from "redux";
import {default as screensReducer} from './screens';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    pages: pagesReducer,
    sortableTables: sortableTablesReducer,
    screens: screensReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
