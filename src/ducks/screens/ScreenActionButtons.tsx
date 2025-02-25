import React from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {saveScreenStatus} from "@/ducks/screens/actions";
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectCanDestroy, selectCanRecover, selectScreenId} from "@/ducks/screens/index";

export default function ScreenActionButtons() {
    const dispatch = useAppDispatch();
    const canRecover = useSelector(selectCanRecover);
    const canDestroy = useSelector(selectCanDestroy);
    const screenId = useSelector(selectScreenId);

    if (screenId === null) {
        return null;
    }

    return (
        <div>
            <Row>
                <Col xs="auto">
                    <Button type="button" size="sm" variant="outline-warning"
                            disabled={!screenId || !canDestroy}
                            onClick={() => dispatch(saveScreenStatus({screenId: screenId ?? 0, active: false}))}>
                        Destroy Screen
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button type="button" size="sm" variant="outline-info"
                            disabled={!screenId || !canRecover}
                            onClick={() => dispatch(saveScreenStatus({screenId: screenId ?? 0, active: true}))}>
                        Recover Screen
                    </Button>
                </Col>
            </Row>
            <small>Note: &#34;Destroy Screen&#34; will set all items on the screen to not active. &#34;Recover Screen&#34; will set
                status of all items to active.</small>
        </div>
    )
}
