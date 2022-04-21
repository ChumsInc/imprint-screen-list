import React from 'react';
import {ErrorBoundary} from "chums-ducks";
import ScreenFilter from "../ducks/screens/ScreenFilter";
import PagedScreenList from "../ducks/screens/PagedScreenList";
import ScreenForm from "../ducks/screens/ScreenForm";
import ScreenEntryEdit from "../ducks/screens/ScreenEntryEdit";
import SelectedScreenList from "../ducks/screens/SelectedScreenList";

const Main:React.FC = () => {

    return (
        <div className="row g-3">
            <div className="col-6">
                <ErrorBoundary>
                    <ScreenFilter />
                </ErrorBoundary>
                <ErrorBoundary>
                    <PagedScreenList/>
                </ErrorBoundary>
            </div>
            <div className="col-6">
                <ErrorBoundary>
                    <ScreenForm/>
                </ErrorBoundary>
                <hr />
                <ErrorBoundary>
                    <ScreenEntryEdit/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <SelectedScreenList/>
                </ErrorBoundary>
            </div>

        </div>
    )
}

export default Main;
