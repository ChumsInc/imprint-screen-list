import React from 'react';
import {useDispatch} from "react-redux";
import ScreenFilter from "./ducks/screens/ScreenFilter";
import ScreenList from "./ducks/screens/ScreenList";
import ScreenForm from "./ducks/screens/ScreenForm";
import ScreenEntryEdit from "./ducks/screens/ScreenEntryEdit";
import SelectedScreenList from "./ducks/screens/SelectedScreenList";

const App:React.FC = () => {
    useDispatch()
    return (
        <div className="row g-3">
            <div className="col-6">
                <ScreenFilter />
                <ScreenList />
            </div>
            <div className="col-6">
                <ScreenForm />
                <ScreenEntryEdit />
                <SelectedScreenList />
            </div>

        </div>
    )
}

export default App;
