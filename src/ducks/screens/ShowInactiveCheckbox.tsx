import React, {ChangeEvent, useId} from "react";

import {useSelector} from "react-redux";
import {selectShowInactive, setShowInactive} from "./index";
import {FormCheck} from "react-bootstrap";
import {useAppDispatch} from "@/app/configureStore";

const ShowInactiveCheckbox = () => {
    const dispatch = useAppDispatch();
    const showInactive = useSelector(selectShowInactive);
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowInactive(ev.target.checked));
    }
    const id = useId();

    return (
        <FormCheck id={id} label={"Show Inactive"}
                   checked={showInactive} onChange={changeHandler} type="checkbox"/>
    )
}

export default ShowInactiveCheckbox;
