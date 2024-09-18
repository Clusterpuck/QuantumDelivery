import React, {useEffect} from 'react';
import AccountDetailsForm from '../components/AccountDetailsForm';
import {enableScroll} from '../assets/scroll.js';

const AdminControls = () => {
    useEffect(() => {
        enableScroll();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
            }}
        >
            <h1>Admin Controls</h1>
        </div>
    );
};
export default AdminControls;
