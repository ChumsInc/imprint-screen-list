import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {useSelector} from "react-redux";
import {ErrorBoundary, selectTableSort} from "chums-ducks";
import {Screen, screenListTableID, ScreenSorterProps, selectScreenList} from "./index";
import {Link} from "react-router-dom";

const ScreenListTable: React.FC<{ list: Screen[] }> = ({list}) => {
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
                    <td>{new Date(screen.timestamp).toLocaleDateString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

const PrintableScreenList: React.FC = () => {

    const sort = useSelector(selectTableSort(screenListTableID)) as ScreenSorterProps;
    const list = useSelector(selectScreenList(sort as ScreenSorterProps));

    const html = renderToStaticMarkup(<ScreenListTable list={list}/>)

    return (
        <ErrorBoundary>
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
                        <Link to="/" className="btn btn-close"/>
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
        </ErrorBoundary>
    )
}

export default PrintableScreenList;
