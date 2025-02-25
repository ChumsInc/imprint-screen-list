import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {selectScreenId} from "./index";
import {loadScreensByScreenId} from "./actions";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {Col, FormControl, Row} from "react-bootstrap";

const ScreenForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const screenId = useAppSelector(selectScreenId);
    const [id, setId] = useState<number | null>(screenId ?? null);

    useEffect(() => {
        setId(screenId ?? null);
    }, [screenId]);


    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!id) {
            return;
        }
        dispatch(loadScreensByScreenId(id));
    }

    const onChangeScreenId = (ev: ChangeEvent<HTMLInputElement>) => {
        const id = Number(ev.target.value || 0);
        setId(id);
    }


    return (
        <Row as="form" className="g-3 align-items-baseline" onSubmit={onSubmit}>
            <Col xs="auto">
                Screen
            </Col>
            <Col xs="auto">
                <FormControl type="search" inputMode="numeric" size="sm"
                             value={String(id || '')} onChange={onChangeScreenId}
                             required/>
            </Col>
            <Col xs="auto">
                <button type="submit" className="btn btn-primary btn-sm">Load Screen</button>
            </Col>
        </Row>
    )
}

export default ScreenForm;
