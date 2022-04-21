import React from 'react';
import PrintableScreenList from "../ducks/screens/PrintableScreenList";
import {Route, Routes} from "react-router-dom";
import Main from "./Main";

const App: React.FC = () => {
    return (
        <div>
            <Routes>
                <Route path="print" element={<PrintableScreenList/>}/>
                <Route index element={<Main/>}/>
            </Routes>
        </div>
    )
}

export default App;
