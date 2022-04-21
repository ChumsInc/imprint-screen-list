import React, {useEffect, useState} from 'react';
import PrintableScreenList from "../ducks/screens/PrintableScreenList";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Main";
import {ErrorBoundary} from "chums-ducks";

const App: React.FC = () => {
    const [baseName, setBaseName] = useState('');
    useEffect(() => {
        setBaseName(window.location.pathname.replace(/\/$/, ''));
    }, [])
    return (
        <BrowserRouter basename={baseName}>
            <ErrorBoundary>
                <div>
                    <Routes>
                        <Route path="" element={<Main/>}/>
                        <Route path="print" element={<PrintableScreenList/>}/>
                    </Routes>
                </div>
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default App;
