import React from "react";
import {Screen} from "./index";
import {SortableTable, SortableTableField} from "chums-ducks";

const TABLE = 'screenList';

const tableFields: SortableTableField[] = [
    // {field: 'id', title: 'ID', sortable: true},
    {field: 'screenId', title: 'Screen', sortable: true},
    {field: 'title', title: 'Description', sortable: true},
    {field: 'twoSided', title: 'Two-Sided', sortable: false, render: ({twoSided}: Screen) => twoSided ? 'Y' : 'N'},
    {
        field: 'timestamp',
        title: 'Updated',
        sortable: true,
        render: ({timestamp}: Screen) => new Date(timestamp).toLocaleDateString()
    },
];

const rowClassNames = (row: Screen) => ({'text-danger': !row.active});

export interface ScreenListProps {
    list: Screen[],
    onSelectRow: (row: Screen) => void,
}

const ScreenList: React.FC<ScreenListProps> = ({list, onSelectRow}) => {
    return (
        <SortableTable tableKey={TABLE} keyField="id" fields={tableFields} data={list} size="xs"
                       rowClassName={rowClassNames}
                       onSelectRow={onSelectRow}/>
    )
}
export default ScreenList;
