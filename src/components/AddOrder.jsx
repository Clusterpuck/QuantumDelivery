import React, { useEffect, useState } from 'react';
import { fetchCustomers, fetchLocations, postMethod } from '../store/apiFunctions';
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
    const [selectedProducts, setSelectedProducts] = useState('')
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

    const handleCustomerFormClose = async (newCustomer) => {
        setShowAddCustomer(false);
        const reloadedCustomers = await fetchCustomers();
        setCustomers(reloadedCustomers);
        //setSelectedCustomer(newCustomer);   
    };

    const handleAddressFormClose = async () => {
        setShowAddressSearch(false);
        const newAddress = await fetchLocations();
        setLocations(newAddress);
    };

    const submitOrder = () => {
        console.log('Submitting order: customerObject ', JSON.stringify(selectedCustomer) )
        console.log('locationObject ', JSON.stringify(selectedLocation) )
        console.log('productlist :', JSON.stringify(selectedProducts))

        const now = new Date().toISOString();  // Get the current date in ISO format

        const orderObject = {
            order: {
                dateOrdered: now,
                orderNotes: "To Be Added",  // You can replace this with actual notes if needed
                customerId: selectedCustomer.id,
                locationId: selectedLocation.id,
            },
            products: selectedProducts.map(product => ({
                productId: product.id,
                quantity: product.quantity
            }))
        };

        console.log('Order object to send is ', JSON.stringify(orderObject))
        postMethod(orderObject, 'Orders');


    }

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
                                getOptionKey={(option) => option.id}
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
                                getOptionKey={ (option) => option.id }
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

            <ProductListForm sendProductList={setSelectedProducts}/>

            <Button 
                variant= {showAddCustomer ? "disabled" : "contained"}
                color="primary" onClick={() => submitOrder()}>
                                Submit Order
            </Button>

            <a href="/">Back Home</a>
        </div>
    );
};

export default AddOrder;
