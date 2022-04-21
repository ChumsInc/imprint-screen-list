import React, {useEffect} from 'react';
import ScreenList from "./ScreenList";
import {useDispatch, useSelector} from "react-redux";
import {loadScreenList, selectScreenEntry} from "./actions";
import {addPageSetAction, pagedDataSelector, PagerDuck, sortableTableSelector, tableAddedAction} from "chums-ducks";
import {Screen, selectScreenList, ScreenSorterProps, selectListFilter} from "./index";

const TABLE = 'screenList';

const PagedScreenList: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadScreenList());
        dispatch(addPageSetAction({key: TABLE}));
        dispatch(tableAddedAction({key: TABLE, field: 'title', ascending: true}));

    }, []);
    const sort = useSelector(sortableTableSelector(TABLE))
    const list = useSelector(selectScreenList(sort as ScreenSorterProps));
    const pagedList = useSelector(pagedDataSelector(TABLE, list));
    const filter = useSelector(selectListFilter);


    return (
        <div>
            <ScreenList list={pagedList} onSelectRow={(selected: Screen) => dispatch(selectScreenEntry(selected))}/>
            <PagerDuck pageKey={TABLE} dataLength={list.length} filtered={!!filter}/>
        </div>
    )
}

export default PagedScreenList;
