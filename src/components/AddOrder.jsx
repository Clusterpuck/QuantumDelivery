import React, { useEffect, useState } from 'react';
import { fetchCustomers, fetchLocations } from '../store/apiFunctions';
import { Autocomplete, Button, Box, Paper, Grid } from '@mui/material';
import AddressSearch from './AddressSearch';
import AddCustomer from './AddCustomer';
import ProductListForm from './ProductListForm';
import TextField from '@mui/material/TextField';

const styleConstants = {
    fieldSpacing: { mb: 2 }
};

const AddOrder = () => {
    const [customers, setCustomers] = useState(null);
    const [locations, setLocations] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [showAddCustomer, setShowAddCustomer] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const newCustomers = await fetchCustomers();
            setCustomers(newCustomers);    
            const newLocations = await fetchLocations();
            setLocations(newLocations);
        };
        loadData();
    }, []);

    const handleCustomerChange = (event, newValue) => {
        setSelectedCustomer(newValue);
        console.log("Selected customer is  " + selectedCustomer.name);
    };

    const handleLocationChange = (event, newValue) => {
        setSelectedLocation(newValue);
        console.log("Selected location is  " + selectedLocation.address);
    };

    const handleCustomerFormClose = async () => {
        setShowAddCustomer(false);
        const newCustomers = await fetchCustomers();
        setCustomers(newCustomers);   
    };

    const handleAddressFormClose = async () => {
        setShowAddressSearch(false);
        const newAddress = await fetchLocations();
        setLocations(newAddress);
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
            <h1>Add Order</h1>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 3, maxWidth: 900, width: '100%' }}>
                    <Grid container spacing={2} >
                        <Grid item xs={6} sx={styleConstants.fieldSpacing}>
                        {customers ? (
                            <Autocomplete
                                disablePortal
                                id="Customers"
                                options={customers}
                                getOptionLabel={(option) => option.name}
                                sx={{ width: 400 }}
                                onChange={handleCustomerChange}
                                renderInput={(params) => <TextField {...params} label="Select Customer" />}
                            />
                        ) : (
                            <p>No Customers</p>
                        )}
                        </Grid>
                        <Grid item xs={6} sx={styleConstants.fieldSpacing}>

                        {locations ? (
                            <Autocomplete
                                disablePortal
                                id="Locations"
                                options={locations}
                                getOptionLabel={(option) => option.address}
                                sx={{ width: 400 }}
                                onChange={handleLocationChange}
                                renderInput={(params) => <TextField {...params} label="Select Location" />}
                            />
                        ) : (
                            <p>No Locations</p>
                        )}
                        </Grid>

                        <Grid item xs={6} sx={styleConstants.fieldSpacing}>
                            <Button variant="contained" color="primary" onClick={() => setShowAddCustomer(!showAddCustomer)}>
                                {showAddCustomer ? 'Hide Customer Form' : 'Add Customer'}
                            </Button>
                        </Grid>

                        <Grid item xs={6} sx={styleConstants.fieldSpacing}>
                            <Button variant="contained" color="primary" onClick={() => setShowAddressSearch(!showAddressSearch)}>
                                {showAddressSearch ? 'Hide Address Form' : 'Add Address'}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Conditionally render the AddCustomer component */}
                    {showAddCustomer && (
                        <Box sx={{ mt: 4 }}>
                            <AddCustomer onCloseForm={handleCustomerFormClose} />
                        </Box>
                    )}

                    {/* Conditionally render the AddressSearch component */}
                    {showAddressSearch && (
                        <Box sx={{ mt: 4 }}>
                            <AddressSearch onCloseForm={handleAddressFormClose} />
                        </Box>
                    )}
                </Paper>
            </Box>

            <ProductListForm/>

            <a href="/">Back Home</a>
        </div>
    );
};

export default AddOrder;
