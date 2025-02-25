import React, {ChangeEvent, useId} from "react";
import {useSelector} from "react-redux";
import {selectScreenSearch, setSearch} from "./index";
import {loadScreenList} from "./actions";
import ShowInactiveCheckbox from "./ShowInactiveCheckbox";
import {Link} from "react-router";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {useAppDispatch} from "@/app/configureStore";

const ScreenFilter = () => {
    const dispatch = useAppDispatch();
    const value = useSelector(selectScreenSearch);
    const inputId = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(ev.target.value));
    }

    const handleLoadClick = () => dispatch(loadScreenList());

    return (
        <Row className="g-3 align-items-baseline">
            <Col xs="auto">
                <InputGroup size="sm">
                    <InputGroup.Text as="label" htmlFor={inputId}>
                        <span className="bi-search" aria-label="Search"/>
                    </InputGroup.Text>
                    <FormControl type="search" size="sm" id={inputId}
                                 value={value} onChange={changeHandler}
                                 placeholder="Search"/>
                </InputGroup>
            </Col>
            <Col xs="auto">
                <ShowInactiveCheckbox/>
            </Col>
            <Col/>
            <Col xs="auto">
                <Button type="button" variant="primary" size="sm" onClick={handleLoadClick}>
                    Reload
                </Button>
            </Col>
            <Col xs="auto">
                <Link to={"/print"} className="btn btn-sm btn-outline-secondary">Print</Link>
            </Col>
        </Row>
    )
}

export default ScreenFilter;
