import React, {useEffect} from 'react';
import PrintableScreenList from "../ducks/screens/PrintableScreenList";
import Main from "./Main";
import {HashRouter, Route, Routes, useLocation, useNavigate} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "@/app/ErrorBoundaryFallbackAlert";
import CurrentScreen from "@/app/CurrentScreen";
import IndexRedirect from "@/app/IndexRedirect";
import {useAppDispatch} from "@/app/configureStore";
import {loadScreenList, validateRole} from "@/ducks/screens/actions";

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadScreenList());
        dispatch(validateRole('imprint'));
    }, []);

    return (
        <HashRouter>
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                <div>
                    <Routes>
                        <Route path="/" element={<IndexRedirect />}>
                            <Route path="list" element={<Main/>}>
                                <Route path=":screenId" element={<CurrentScreen/>}/>
                            </Route>
                            <Route path="print" element={<PrintableScreenList/>}/>
                        </Route>

                    </Routes>
                </div>
            </ErrorBoundary>
        </HashRouter>
    )
}

export default App;
