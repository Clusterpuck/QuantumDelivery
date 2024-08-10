import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCustomers, fetchLocations } from '../store/apiFunctions';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, Box, Paper, Grid } from '@mui/material';
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
    const [openAddress, setOpenAddress] = useState(false);
    const [openCustomer, setOpenCustomer] = useState(false);

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


    const handleClickOpenAddress = () => {
        setOpenAddress(true);
    };

    const handleClickOpenCustomer = () => {
        setOpenCustomer(true);
    }

    const handleClose = () => {
        setOpenAddress(false);
        setOpenCustomer(false);
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
                            <p>No Customers</p>
                        )}
                        </Grid>

                        <Grid item xs={6} sx={styleConstants.fieldSpacing}>

                        {/* Button to open the modal */}
                        <Button variant="contained" color="primary" onClick={handleClickOpenCustomer}>
                            Add Customer
                        </Button>

                        </Grid>

                        <Grid item xs={6} sx={styleConstants.fieldSpacing}>

                        {/* Button to open the modal */}
                        <Button variant="contained" color="primary" onClick={handleClickOpenAddress}>
                            Add Address
                        </Button>

                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Dialog for AddressSearch */}
            <Dialog open={openAddress} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <AddressSearch />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCustomer} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <AddCustomer />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <ProductListForm/>

            



            <a href="/">Back Home</a>
        </div>
    );
};

export default AddOrder;
