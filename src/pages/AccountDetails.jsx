import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
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
            <h1>Account Details</h1>
            <AccountDetailsForm/>
        </div>
    );
};

export default AccountDetails;
