import React from 'react';
import { Link } from 'react-router-dom';
import AccountDetailsForm from '../components/AccountDetailsForm';

const AccountDetails = () => {
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
