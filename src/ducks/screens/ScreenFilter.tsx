import React from "react";
import {Input} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {screenFilterSelector, showInactiveSelector} from "./index";
import {filterChanged, loadScreenList} from "./actions";
import ShowInactiveCheckbox from "./ShowInactiveCheckbox";

const ScreenFilter: React.FC = () => {
    const dispatch = useDispatch();
    const showInactive = useSelector(showInactiveSelector);
    const filter = useSelector(screenFilterSelector);

    return (
        <div className="row g-3">
            <div className="col-auto">
                <Input value={filter} onChange={(ev) => dispatch(filterChanged(ev.target.value || ''))} type="search"
                       placeholder="Search"/>
            </div>
            <div className="col-auto">
                <ShowInactiveCheckbox/>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-primary"
                        onClick={() => dispatch(loadScreenList())}>Reload
                </button>
            </div>
        </div>
    )
}

export default ScreenFilter;
