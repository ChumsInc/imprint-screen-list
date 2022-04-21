import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {Input} from "chums-ducks";
import {useDispatch, useSelector} from "react-redux";
import {selectCanDestroy, selectCanRecover, selectCurrentScreen} from "./index";
import {loadScreenList, saveScreenStatus} from "./actions";

const ScreenForm: React.FC = () => {
    const dispatch = useDispatch();
    const canRecover = useSelector(selectCanRecover);
    const canDestroy = useSelector(selectCanDestroy);
    const selected = useSelector(selectCurrentScreen);
    const [screenId, setScreenId] = useState(selected.screenId);
    let onSubmitTimer: number;

    useEffect(() => {
        setScreenId(selected.screenId);
    }, [selected.screenId])

    useEffect(() => {
        return () => clearTimeout(onSubmitTimer);
    }, []);

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        onSubmitTimer = window.setTimeout(() => {
            if (!screenId) {
                return;
            }
            dispatch(loadScreenList(Number(screenId)));
        }, 25);
    }

    const onChangeScreenId = (ev: ChangeEvent<HTMLInputElement>) => {
        const id = Number(ev.target.value || 0);
        setScreenId(id);
    }
    return (
        <>
            <form className="row g-3 align-items-baseline" onSubmit={onSubmit}>
                <div className="col-auto">
                    Screen
                </div>
                <div className="col-auto">
                    <Input type="number" bsSize="sm" value={String(screenId || '')} onChange={onChangeScreenId}
                           required/>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary btn-sm">Load Screen</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-warning btn-sm"
                            disabled={screenId === 0 || !canDestroy}
                            onClick={() => dispatch(saveScreenStatus(false))}>
                        Destroy Screen
                    </button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-info btn-sm"
                            disabled={screenId === 0 || !canRecover}
                            onClick={() => dispatch(saveScreenStatus(true))}>
                        Recover Screen
                    </button>
                </div>
            </form>
            <small>Note: "Destroy Screen" will set all items on the screen to not active. "Recover Screen" will set
                status of all items to active.</small>
        </>
    )
}

export default ScreenForm;
