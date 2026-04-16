import {selectScreenId} from "./index";
import {loadScreensByScreenId} from "./actions";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {Col, FormControl, Row} from "react-bootstrap";

const ScreenForm = () => {
    const dispatch = useAppDispatch();
    const screenId = useAppSelector(selectScreenId);


    const onSubmit = (formData: FormData) => {
        const screenId = formData.get('screenId') as string;
        dispatch(loadScreensByScreenId(screenId));
    }

    return (
        <Row as="form" className="g-3 align-items-baseline" action={onSubmit}>
            <Col xs="auto">
                Screen
            </Col>
            <Col xs="auto">
                <FormControl type="search" inputMode="numeric" size="sm" name="screenId"
                             defaultValue={`${screenId ?? ''}`} required/>
            </Col>
            <Col xs="auto">
                <button type="submit" className="btn btn-primary btn-sm">Load Screen</button>
            </Col>
        </Row>
    )
}

export default ScreenForm;
