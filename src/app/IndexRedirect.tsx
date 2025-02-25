import React, {useEffect} from 'react';
import {Outlet, useNavigate} from "react-router";

export default function IndexRedirect() {
    const nav = useNavigate();

    useEffect(() => {
        nav('/list', {replace: true})
    }, []);

    return (
        <Outlet />
    );
}
