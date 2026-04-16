import {useId, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SortableTable, type SortableTableField} from "@chumsinc/sortable-tables";
import type {ImprintScreen} from "@/ducks/types";
import {useAppSelector} from "@/app/configureStore";
import {
    selectCurrentListSort,
    selectCurrentScreenEntry,
    selectCurrentScreenList,
    selectScreenStatus,
    setCurrentScreenItem,
    setCurrentScreenSort
} from "@/ducks/screens/index";
import {FormCheck, ProgressBar} from "react-bootstrap";
import type {SortProps} from "chums-types";

const tableFields: SortableTableField<ImprintScreen>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'screenId', title: 'Screen', sortable: true},
    {field: 'title', title: 'Description', sortable: true},
    {
        field: 'twoSided', title: 'Two-Sided', sortable: false,
        render: ({twoSided}) => twoSided ? 'Y' : 'N'
    },
    {
        field: 'timestamp',
        title: 'Updated',
        sortable: true,
        render: ({timestamp}) => timestamp ? new Date(timestamp).toLocaleDateString() : null,
    },
];

const rowClassNames = (row: ImprintScreen) => ({'text-danger': !row.active});

const CurrentScreenList = () => {
    const dispatch = useDispatch();
    const sort = useAppSelector(selectCurrentListSort);
    const current = useAppSelector(selectCurrentScreenEntry);
    const list = useAppSelector(selectCurrentScreenList);
    const loading = useSelector(selectScreenStatus);
    const id = useId();
    const [showInactive, setShowInactive] = useState(false);

    const sortChangedHandler = (sort: SortProps<ImprintScreen>) => {
        dispatch(setCurrentScreenSort(sort));
    }

    const rowSelectHandler = (row: ImprintScreen) => {
        dispatch(setCurrentScreenItem(row));
    }
    return (
        <div className="mt-3">
            {loading !== 'idle' && (
                <ProgressBar now={100} striped animated/>
            )}
            <div>
                <FormCheck label={"Show Inactive"} id={id}
                           checked={showInactive} onClick={() => setShowInactive(!showInactive)}
                           type="checkbox"/>
            </div>
            <SortableTable keyField="id" fields={tableFields}
                           data={list.filter(screen => showInactive || screen.active)}
                           selected={current?.id}
                           size="xs"
                           rowClassName={rowClassNames}
                           currentSort={sort} onChangeSort={sortChangedHandler}
                           onSelectRow={rowSelectHandler}/>
        </div>
    )
}

export default CurrentScreenList;
