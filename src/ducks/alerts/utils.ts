import {StyledErrorAlert} from "@/ducks/types";


export const alertSorter = (a: StyledErrorAlert, b: StyledErrorAlert) => a.id - b.id;
