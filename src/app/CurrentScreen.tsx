import React from 'react';
import ScreenEntryEdit from "@/ducks/screens/ScreenEntryEdit";
import CurrentScreenList from "@/ducks/screens/CurrentScreenList";

export default function CurrentScreen() {
    return (
        <div>
            <hr />
            <ScreenEntryEdit/>
            <CurrentScreenList/>
        </div>
    )
}
