import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from "react";
import {selectCurrentScreenEntry, selectScreenId, selectScreenStatus} from "./index";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {ImprintScreen} from "@/ducks/types";
import {newImprintScreen} from "@/ducks/screens/utils";
import {deleteEntryScreenEntry, saveScreenEntry} from "@/ducks/screens/actions";
import {Button, Col, FormCheck, FormControl, InputGroup, Row} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";

const ScreenEntryEdit = () => {
    const dispatch = useAppDispatch();
    const current = useAppSelector(selectCurrentScreenEntry);
    const screenId = useAppSelector(selectScreenId);
    const status = useAppSelector(selectScreenStatus);
    const [screen, setScreen] = useState<ImprintScreen>({
        ...(current ?? {
            ...newImprintScreen,
            screenId: screenId ?? 0
        })
    });
    const titleId = useId();
    const twoSidedId = useId();
    const activeId = useId();

    useEffect(() => {
        if (current) {
            setScreen(current);
            return;
        }
        setScreen({...newImprintScreen, screenId: screenId ?? 0});
    }, [current]);

    const changeHandler = (field: keyof ImprintScreen) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'title':
                setScreen({...screen, title: ev.target.value, changed: true});
                return;
            case 'twoSided':
            case 'active':
                setScreen({...screen, [field]: ev.target.checked, changed: true});
                return;
        }
    }

    const onSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        await dispatch(saveScreenEntry(screen));
        if (!screen.id) {
            setScreen({...newImprintScreen, screenId: screenId ?? 0});
        }
    }

    const confirmLoseChanges = (): boolean => {
        return screen.changed
            ? window.confirm('Are you sure you want to lose your changes?')
            : true;
    }

    const onCancel = () => {
        if (!confirmLoseChanges()) {
            return;
        }
        setScreen({...(current ?? {...newImprintScreen, screenId: screenId ?? 0})});
    }

    const onNewScreen = () => {
        if (!confirmLoseChanges()) {
            return;
        }
        setScreen({...newImprintScreen, screenId: screenId ?? 0});
    }

    const onDelete = () => {
        if (current && window.confirm('Are you sure you want to delete this screen entry?')) {
            dispatch(deleteEntryScreenEntry(current));
        }
    }


    if (!screenId) {
        return null;
    }

    return (
        <form onSubmit={onSubmit} className="mt-3">
            <Row className="g-3">
                <Col xs={12} md={6}>
                    <InputGroup size="sm">
                        <InputGroup.Text as="label">ID: {screen.id || '[new]'}</InputGroup.Text>
                        <InputGroup.Text as="label" htmlFor={titleId}>
                            Title
                        </InputGroup.Text>
                        <FormControl type="text" id={titleId} required
                                     value={screen.title} onChange={changeHandler('title')} disabled={!screenId}/>
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <FormCheck id={twoSidedId} onChange={changeHandler('twoSided')} checked={screen.twoSided}
                               label="Two Sided"/>
                </Col>
                <Col xs="auto">
                    <FormCheck id={activeId} onChange={changeHandler('active')} checked={screen.active} label="Active"/>
                </Col>
            </Row>
            {screen.changed && (
                <Alert variant="warning" className="mt-1">
                    <strong className="bi-exclamation-triangle-fill"/> Don&#39;t forget to save!
                </Alert>
            )}
            <Row className="g-3 mt-1 justify-content-end">
                <Col xs="auto">
                    <Button type="submit" variant="primary" size="sm" disabled={status !== 'idle'}>Save</Button>
                </Col>
                <Col xs="auto">
                    <Button type="button" variant="outline-secondary" size="sm"
                            onClick={onCancel} disabled={status !== 'idle'}>
                        Cancel Changes
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button type="button" variant="outline-primary" size="sm" onClick={onNewScreen}
                            disabled={status !== 'idle'}>
                        New Entry
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button type="button" variant="outline-danger" size="sm"
                            disabled={status !== 'idle' || screen.id === 0} onClick={onDelete}>
                        Delete Entry
                    </Button>
                </Col>
            </Row>
        </form>
    )
}

export default ScreenEntryEdit;
