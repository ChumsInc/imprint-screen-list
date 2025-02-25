import {SortProps} from "chums-types";
import {ImprintScreen} from "@/ducks/types";

export const screenListSorter = (sort: SortProps<ImprintScreen>) => (a: ImprintScreen, b: ImprintScreen) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'screenId':
            return (
                a.screenId === b.screenId
                    ? (a.id - b.id)
                    : (a.screenId - b.screenId)
            ) * sortMod
        case 'title':
            return (
                a.title.localeCompare(b.title) === 0
                    ? (a.id - b.id)
                    : a.title.localeCompare(b.title)
            ) * sortMod;
        case 'twoSided':
        case 'active':
            return (
                a[field] === b[field]
                    ? (a.id - b.id)
                    : (+a[field] - +b[field])
            ) * sortMod;
        case 'timestamp':
            return (
                (a[field] ?? '') === (b[field] ?? '')
                    ? (a.id - b.id)
                    : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1)
            ) * sortMod;

        default:
        case 'id':
            return (a.id - b.id) * sortMod
    }
}

export const newImprintScreen:ImprintScreen = {
    id: 0,
    screenId: 0,
    title: '',
    active: true,
    twoSided: false,
}
