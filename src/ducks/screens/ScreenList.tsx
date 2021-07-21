import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadScreenList, selectScreenEntry} from "./actions";
import {Screen, screenFilterSelector, screenListSelector, screenLoadingSelector, ScreenSorterProps} from "./index";
import {
    addPageSetAction,
    pagedDataSelector, PagerDuck,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";

const TABLE = 'screenList';

const tableFields:SortableTableField[] = [
    // {field: 'id', title: 'ID', sortable: true},
    {field: 'screenId', title: 'Screen', sortable: true},
    {field: 'title', title: 'Description', sortable: true},
    {field: 'twoSided', title: 'Two-Sided', sortable: false, render: ({twoSided}:Screen) => twoSided ? 'Y' : 'N'},
    {field: 'timestamp', title: 'Updated', sortable: true, render: ({timestamp}:Screen) => new Date(timestamp).toLocaleDateString()},
];

const rowClassNames = (row:Screen) => ({'text-danger': !row.active});

const ScreenList:React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadScreenList());
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'title', ascending: true}));

    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    const list = useSelector(screenListSelector(sort as ScreenSorterProps));
    const loading = useSelector(screenLoadingSelector);
    const pagedList = useSelector(pagedDataSelector(TABLE, list));
    const filter = useSelector(screenFilterSelector);


    return (
        <div>
            <SortableTable tableKey={TABLE} keyField="id" fields={tableFields} data={pagedList}
                           rowClassName={rowClassNames}
                           onSelectRow={(selected:Screen) => dispatch(selectScreenEntry(selected))} />
            <PagerDuck pageKey={TABLE} dataLength={list.length} filtered={!!filter}  />
        </div>
    )
}

export default ScreenList;
