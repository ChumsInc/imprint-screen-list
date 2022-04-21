import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectScreenEntry} from "./actions";
import {
    Screen,
    screenSorter,
    ScreenSorterProps,
    selectCurrentLoading,
    selectCurrentScreen,
    selectCurrentScreenLines
} from "./index";
import {
    addPageSetAction,
    FormCheck,
    Progress,
    ProgressBar,
    SortableTable,
    SortableTableField,
    sortableTableSelector,
    tableAddedAction
} from "chums-ducks";

const TABLE = 'screenList-Selected';

const tableFields: SortableTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'screenId', title: 'Screen', sortable: true},
    {field: 'title', title: 'Description', sortable: true},
    {field: 'twoSided', title: 'Two-Sided', sortable: false, render: ({twoSided}: Screen) => twoSided ? 'Y' : 'N'},
    {
        field: 'timestamp',
        title: 'Updated',
        sortable: false,
        render: ({timestamp}: Screen) => new Date(timestamp).toLocaleDateString()
    },
];

const rowClassNames = (row: Screen) => ({'text-danger': !row.active});

const SelectedScreenList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'title', ascending: true}));

    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    const selected = useSelector(selectCurrentScreen)
    const currentScreenList = useSelector(selectCurrentScreenLines);
    const loading = useSelector(selectCurrentLoading);
    const [showInactive, setShowInactive] = useState(false);

    const list = currentScreenList.filter(screen => showInactive || screen.active)
        .sort(screenSorter(sort as ScreenSorterProps));

    return (
        <div className="mt-3">
            {loading && (
                <Progress><ProgressBar color="primary" striped/></Progress>
            )}
            <div>
                <FormCheck label={"Show Inactive"} checked={showInactive} onClick={() => setShowInactive(!showInactive)}
                           type="checkbox"/>
            </div>
            <SortableTable tableKey={TABLE} keyField="id" fields={tableFields} data={list} selected={selected.id}
                           size="xs"
                           rowClassName={rowClassNames}
                           onSelectRow={(selected: Screen) => dispatch(selectScreenEntry(selected))}/>
        </div>
    )
}

export default SelectedScreenList;
