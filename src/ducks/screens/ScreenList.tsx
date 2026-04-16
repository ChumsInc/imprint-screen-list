import {useEffect, useState} from "react";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import type {ImprintScreen} from "@/ducks/types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectFilteredScreensList, selectScreenSort, setScreenId, setScreenSort} from "@/ducks/screens/index";
import type {SortProps} from "chums-types";
import dayjs from "dayjs";

const tableFields: SortableTableField<ImprintScreen>[] = [
    {field: 'screenId', title: 'Screen', sortable: true},
    {field: 'title', title: 'Description', sortable: true},
    {field: 'twoSided', title: 'Two-Sided', sortable: false, render: ({twoSided}) => twoSided ? 'Y' : 'N'},
    {
        field: 'timestamp',
        title: 'Updated',
        sortable: true,
        render: ({timestamp}) => timestamp ? dayjs(timestamp).format('MM/DD/YYYY') : null
    },
];

const rowClassNames = (row: ImprintScreen) => ({'text-danger': !row.active});

const ScreenList = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectFilteredScreensList);
    const sort = useAppSelector(selectScreenSort);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        Promise.resolve().then(() => {
            setPage(0)
        })
    }, [list, rowsPerPage]);

    const selectRowHandler = (row: ImprintScreen) => {
        dispatch(setScreenId(row.screenId));
    }

    const sortChangeHandler = (sort: SortProps<ImprintScreen>) => {
        dispatch(setScreenSort(sort));
    }

    return (
        <div>
            <SortableTable fields={tableFields} keyField="id" size="xs"
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           rowClassName={rowClassNames}
                           onSelectRow={selectRowHandler}/>
            <TablePagination count={list.length} size="sm"
                             page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: setRowsPerPage}}
                             showFirst showLast
            />
        </div>
    )
}
export default ScreenList;
