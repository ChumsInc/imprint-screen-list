import React, {ChangeEvent} from "react";
import {Input} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {selectListFilter} from "./index";
import {filterChanged, loadScreenList} from "./actions";
import ShowInactiveCheckbox from "./ShowInactiveCheckbox";
import {Link} from "react-router-dom";

const ScreenFilter: React.FC = () => {
    const dispatch = useDispatch();
    const filter = useSelector(selectListFilter);

    const handleFilterChange = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(filterChanged(ev.target.value || ''));
    }

    const handleLoadClick = () => dispatch(loadScreenList());

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <Input value={filter} onChange={handleFilterChange} type="search"
                       bsSize="sm"
                       placeholder="Search"/>
            </div>
            <div className="col-auto">
                <ShowInactiveCheckbox/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-primary"
                        onClick={handleLoadClick}>
                    Reload
                </button>
            </div>
            <div className="col-auto">
                <Link to={"/print"} className="btn btn-sm btn-outline-secondary">Print</Link>
            </div>
        </div>
    )
}

export default ScreenFilter;
