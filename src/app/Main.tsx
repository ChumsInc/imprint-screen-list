import ScreenFilter from "../ducks/screens/ScreenFilter";
import ScreenForm from "../ducks/screens/ScreenForm";
import ScreenEntryEdit from "../ducks/screens/ScreenEntryEdit";
import CurrentScreenList from "@/ducks/screens/CurrentScreenList";
import {Card, Col, Row} from "react-bootstrap";
import ScreenList from "@/ducks/screens/ScreenList";
import ScreenActionButtons from "@/ducks/screens/ScreenActionButtons";
import {useAppSelector} from "@/app/configureStore";
import {selectScreenId} from "@/ducks/screens";

const Main = () => {
    const screenId = useAppSelector(selectScreenId);

    return (
        <Row className="g-3">
            <Col md={6}>
                <h2>Screen List</h2>
                <ScreenFilter />
                <ScreenList />
            </Col>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <div className="d-flex justify-content-between align-items-baseline">
                            <h2>Current Screen</h2>
                            <ScreenForm/>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <h2>Screen: {screenId ?? 'select or enter a screen'}</h2>
                        <ScreenActionButtons />
                        <ScreenEntryEdit/>
                        <CurrentScreenList/>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Main;
