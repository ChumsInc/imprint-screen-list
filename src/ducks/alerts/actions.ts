import {createAction} from "@reduxjs/toolkit";
import {StyledErrorAlert} from "@/ducks/types";

export const dismissAlert = createAction<Partial<Pick<StyledErrorAlert, 'id' | 'context'>>>('alerts/dismiss');
export const addAlert = createAction<StyledErrorAlert>('alerts/addAlert');
