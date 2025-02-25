import {RootState} from "@/app/configureStore";

export const selectAlerts = (state: RootState) => state.alerts.list;
