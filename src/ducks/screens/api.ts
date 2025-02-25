import {ImprintScreen, ImprintScreenResponse, ValidateRoleResponse} from "@/ducks/types";
import {fetchJSON} from "@chumsinc/ui-utils";

export async function fetchPermissions(arg:string):Promise<boolean> {
    try {
        const url = `/api/user/validate/role/${encodeURIComponent(arg)}`;
        const res = await fetchJSON<ValidateRoleResponse>(url, {cache: 'no-cache'});
        return res?.success ?? false;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchPermissions()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchPermissions()", err);
        return Promise.reject(new Error('Error in fetchPermissions()'));
    }
}

export async function fetchScreenList():Promise<ImprintScreen[]> {
    try {
        const url = '/api/operations/imprint/screens.json';
        const res = await fetchJSON<ImprintScreenResponse>(url, {cache: 'no-cache'});
        return res?.screens ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}

export async function fetchScreen(screenId: string|number):Promise<ImprintScreen[]> {
    try {
        const url = '/api/operations/imprint/screens/:screenId.json'
            .replace(':screenId', encodeURIComponent(screenId));
        const res = await fetchJSON<ImprintScreenResponse>(url, {cache: 'no-cache'});
        return res?.screens ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadScreen()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadScreen()", err);
        return Promise.reject(new Error('Error in loadScreen()'));
    }
}

export async function postScreenEntry(screen:ImprintScreen):Promise<ImprintScreen[]> {
    try {
        const url = '/api/operations/imprint/screens/:screenId.json'
            .replace(':screenId', encodeURIComponent(screen.screenId));
        const method = screen.id === 0 ? 'POST' : 'PUT';
        const res = await fetchJSON<ImprintScreenResponse>(url, {method, body: JSON.stringify(screen)});
        return res?.screens ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postScreenEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("postScreenEntry()", err);
        return Promise.reject(new Error('Error in postScreenEntry()'));
    }
}

export async function putScreenStatus(arg:Pick<ImprintScreen, 'screenId'|'active'>):Promise<ImprintScreen[]> {
    try {
        const url = '/api/operations/imprint/screens/:screenId/.json'
            .replace(':screenId', encodeURIComponent(arg.screenId));
        const body = JSON.stringify({active: arg.active});
        const res = await fetchJSON<ImprintScreenResponse>(url, {method: 'PUT', body});
        return res?.screens ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("putScreenStatus()", err.message);
            return Promise.reject(err);
        }
        console.debug("putScreenStatus()", err);
        return Promise.reject(new Error('Error in putScreenStatus()'));
    }
}

export async function delScreenEntry(screen:ImprintScreen):Promise<ImprintScreen[]> {
    try {
        const url = '/api/operations/imprint/screens/:screenId/:id.json'
            .replace(':screenId', encodeURIComponent(screen.screenId))
            .replace(':id', encodeURIComponent(screen.id));
        const res = await fetchJSON<ImprintScreenResponse>(url, {method: 'DELETE'});
        return res?.screens ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("delScreenEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("delScreenEntry()", err);
        return Promise.reject(new Error('Error in delScreenEntry()'));
    }
}
