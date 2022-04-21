import React from "react";
import {FormCheck} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {selectShowInactive} from "./index";
import {toggleShowInactive} from "./actions";

const ShowInactiveCheckbox:React.FC = () => {
    const dispatch = useDispatch();
    const showInactive = useSelector(selectShowInactive);
    const onClick = () => dispatch(toggleShowInactive());
    return (
        <FormCheck label={"Show Inactive"} checked={showInactive} onClick={onClick} type="checkbox" />
    )
}

export default ShowInactiveCheckbox;
