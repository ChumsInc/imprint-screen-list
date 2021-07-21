import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadScreenList, selectScreenEntry} from "./actions";
import {
    Screen,
    screenEntryLoadingSelector,
    screenFilterSelector, screenListByScreenIDSelector,
    screenListSelector,
    screenLoadingSelector,
    ScreenSorterProps, selectedScreenSelector
} from "./index";
import {
    addPageSetAction,
    pagedDataSelector, PagerDuck, Progress, ProgressBar,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";
import ShowInactiveCheckbox from "./ShowInactiveCheckbox";

const TABLE = 'screenList-Selected';

const tableFields:SortableTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'screenId', title: 'Screen', sortable: true},
    {field: 'title', title: 'Description', sortable: true},
    {field: 'twoSided', title: 'Two-Sided', sortable: false, render: ({twoSided}:Screen) => twoSided ? 'Y' : 'N'},
    {field: 'timestamp', title: 'Updated', sortable: false, render: ({timestamp}:Screen) => new Date(timestamp).toLocaleDateString()},
];

const rowClassNames = (row:Screen) => ({'text-danger': !row.active});

const SelectedScreenList:React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'title', ascending: true}));

    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    const selected = useSelector(selectedScreenSelector)
    const list = useSelector(screenListByScreenIDSelector(selected.screenId, sort as ScreenSorterProps));
    const loading = useSelector(screenEntryLoadingSelector);

    return (
        <div className="mt-3">
            {loading && (
                <Progress><ProgressBar color="primary" striped /></Progress>
            )}
            <div><ShowInactiveCheckbox /></div>
            <SortableTable tableKey={TABLE} keyField="id" fields={tableFields} data={list} selected={selected.id}
                           rowClassName={rowClassNames}
                           onSelectRow={(selected:Screen) => dispatch(selectScreenEntry(selected))} />
        </div>
    )
}

export default SelectedScreenList;
