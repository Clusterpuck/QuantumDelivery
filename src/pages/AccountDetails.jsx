import React, {useEffect} from 'react';
import AccountDetailsForm from '../components/AccountDetailsForm';
import {enableScroll} from '../assets/scroll.js';

const AccountDetails = () => {
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
            
            <AccountDetailsForm />
        </div>
    );
};

export default AccountDetails;
