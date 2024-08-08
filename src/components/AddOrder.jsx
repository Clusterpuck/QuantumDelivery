import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCustomers } from '../store/apiFunctions';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

const AddOrder = () => {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState('');

    useEffect(() => {
        const loadCustomers = async () => {
            const newCustomers = await fetchCustomers();
            setCustomers(newCustomers);    
        };
        loadCustomers();
    }, []);

    const handleChange = (event, newValue) => {
        setSelectedCustomer(newValue);
        console.log("Selected customer is  " + selectedCustomer.name);
    };

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
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Link to="/viewroutes" className="nav-link">View Routes</Link>
                <Link to="/livetracking" className="nav-link">Live Tracking</Link>
                <Link to="/dailyreport" className="nav-link">Daily Reports</Link>
                <Link to="/addorder" className="nav-link">Add Order</Link>
            </div>

            <h1>Add Order</h1>
            {customers ? (
                <Autocomplete
                disablePortal
                id="Customers"
                options={customers}
                getOptionLabel={(option) => option.name}
                sx={{ width: 400 }}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} label="Select Customer" />}
                />
            ) : (
                <p>No Customers</p>
            )}
            <a href="/">Back Home</a>
        </div>
    );
};

export default AddOrder;
