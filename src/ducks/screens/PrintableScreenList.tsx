import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Link} from "react-router";
import {ImprintScreen} from "@/ducks/types";
import {useAppSelector} from "@/app/configureStore";
import {selectScreensList, selectScreenSort} from "@/ducks/screens/index";
import {ErrorBoundary} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";

const ScreenListTable = ({list}: { list: ImprintScreen[] }) => {
    return (
        <table className="table table-xs">
            <thead>
            <tr>
                <th className="text-end"><span className="me-3">Screen</span></th>
                <th>Description</th>
                <th className="text-center">Two-Sided</th>
                <th>Updated</th>
            </tr>
            </thead>
            <tbody>
            {list.map(screen => (
                <tr key={screen.id}>
                    <td className="text-end">
                        <span className="me-3">{screen.screenId}</span>
                    </td>
                    <td>{screen.title}</td>
                    <td className="text-center">{screen.twoSided ? 'Y' : 'N'}</td>
                    <td>{screen.timestamp ? new Date(screen.timestamp).toLocaleDateString() : 'N/A'}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

const PrintableScreenList = () => {
    const sort = useAppSelector(selectScreenSort);
    const list = useAppSelector(selectScreensList);

    const html = renderToStaticMarkup(<ScreenListTable list={list}/>)

    return (
        <ErrorBoundary fallback={<Alert variant="warning">Something went wrong - PrintableScreenList()</Alert>}>
            <div className="container">
                <div className="row g-3 align-items-baseline">
                    <div className="col">
                        <h3>Screen List</h3>
                        <h4>
                            Sort by
                            {' '}
                            {sort.field === 'screenId' && <strong>Screen</strong>}
                            {sort.field === 'title' && <strong>Description</strong>}
                            {sort.field === 'timestamp' && <strong>Date Updated</strong>}
                        </h4>
                    </div>
                    <div className="col-auto">
                        <Link to="/list" className="btn btn-close"/>
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
        </ErrorBoundary>
    )
}

export default PrintableScreenList;
