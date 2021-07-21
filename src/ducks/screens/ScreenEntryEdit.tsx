import React, {FormEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectedScreenSelector} from "./index";
import {Alert, FieldInput, FormCheck, FormColumn, InputField} from "chums-ducks";
import {changeScreenCancelled, changeScreenEntry, deleteScreenEntry, newScreenEntry, saveScreenEntry} from "./actions";

const ScreenEntryEdit:React.FC = () => {
    const dispatch = useDispatch();
    const changeHandler = ({field, value}:InputField) => {
        dispatch(changeScreenEntry({[field]: value}));
    }

    const onSubmit = (ev:FormEvent) => {
        ev.preventDefault();
        dispatch(saveScreenEntry());
    }

    const onCancel = () => {
        dispatch(changeScreenCancelled());
    }

    const onNewScreen = () => {
        dispatch(newScreenEntry());
    }

    const onDelete = () => {
        if (window.confirm('Are you sure you want to delete this screen entry?')) {
            dispatch(deleteScreenEntry());
        }
    }

    const selected = useSelector(selectedScreenSelector);
    const {id, screenId, title, twoSided, active, changed} = selected;

    return (
        <form onSubmit={onSubmit} className="mt-3">
            <div className="row g-3" >
                <h4 className="col-6">Screen: <strong>{screenId || 'new'}</strong></h4>
                <h4 className="col-6">ID: <strong>{id || 'new'}</strong></h4>
            </div>
            <FormColumn label="Title" width={8} >
                <FieldInput field="title" value={title} onChange={changeHandler} required />
            </FormColumn>
            <FormColumn label="Options" width={8}>
                <FormCheck label="Two Sided" checked={twoSided}
                           onClick={() => changeHandler({field:'twoSided', value: !twoSided})}
                           type="checkbox" inline />
                <FormCheck label="Active" checked={active}
                           onClick={() => changeHandler({field:'active', value: !active})}
                           type="checkbox" inline />
            </FormColumn>
            {changed && (
                <Alert color="warning">
                    <strong className="bi-exclamation-triangle-fill" /> Don't forget to save!
                </Alert>
            )}
            <div className="row g-3">
                <div className="col-4">&nbsp;</div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary btn-sm">Save</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary btn-sm"
                            onClick={onCancel} disabled={id === 0}>
                        Cancel Changes
                    </button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onNewScreen}>
                        New Entry
                    </button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-danger btn-sm"
                            disabled={id === 0} onClick={onDelete}>
                        Delete Entry
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ScreenEntryEdit;
