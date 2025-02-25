import {ErrorAlert} from "@chumsinc/ui-utils";
import {Variant} from "react-bootstrap/types";

export interface ImprintScreen {
    id: number,
    screenId: number,
    title: string,
    twoSided: boolean,
    active: boolean,
    timestamp?: string,
    changed?: boolean,
}

export interface ImprintScreenResponse {
    screens: ImprintScreen[];
}

export interface StyledErrorAlert extends ErrorAlert {
    variant?: Variant
}

export interface ValidateRoleResponse {
    id: number;
    success: boolean;
}
