import React, { useEffect, useState } from 'react';
import { fetchCustomers, fetchLocations, postMethod } from '../store/apiFunctions.js';
import { Autocomplete, Button, Box, Paper, Grid, TextField, Snackbar, Alert, Divider } from '@mui/material';
import AddressSearch from '../components/AddressSearch.jsx';
import AddCustomer from '../components/AddCustomer.jsx';
import ProductListForm from '../components/ProductListForm.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import Typography from '@mui/material/Typography';

const styleConstants = {
    fieldSpacing: { mb: 2 }
};

const AddOrder = () => {
    const [customers, setCustomers] = useState(null);
    const [locations, setLocations] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedProducts, setSelectedProducts] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [refreshOrders, setRefreshOrders] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

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
        //console.log("Selected customer is  " + selectedCustomer.name);
    };

    const handleLocationChange = (event, newValue) => {
        setSelectedLocation(newValue);
        //console.log("Selected location is  " + selectedLocation.address);
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

    const submitOrder = async (event) => {
        event.preventDefault();
        if (!selectedCustomer || !selectedLocation || selectedProducts.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please fill in all required fields.',
                severity: 'error',
            });
            return;
        }

        console.log('Submitting order: customerObject ', JSON.stringify(selectedCustomer) )
        console.log('locationObject ', JSON.stringify(selectedLocation) )
        console.log('productlist :', JSON.stringify(selectedProducts))

        const now = new Date().toISOString();  // Get the current date in ISO format

        const orderObject = {
            order: {
                dateOrdered: now,
                orderNotes: orderNote ? orderNote : "No Note",  // You can replace this with actual notes if needed
                customerId: selectedCustomer.id,
                locationId: selectedLocation.id,
            },
            products: selectedProducts.map(product => ({
                productId: product.id,
                quantity: product.quantity
            }))
        };

        console.log('Order object to send is ', JSON.stringify(orderObject))
        const result = await postMethod(orderObject, 'Orders');
        if(result!= null )
        {
            setRefreshOrders(prev => prev + 1); // Change the trigger value to refresh data
            setSnackbar({
                open: true,
                message: 'Order submitted successfully!',
                severity: 'success',
            });

            // setTimeout(() => {
            //     // Trigger page refresh
            //     window.location.reload(); // Refresh the page programmatically
            // }, 1500); // 2 seconds delay

        }
        else
        {
            setSnackbar({
                open: true,
                message: 'Failed to submit order.',
                severity: 'error',
            });

        }

    }

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };


    return (
        <div
           
        >
            <Typography variant="h3" component="h1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MoveToInboxIcon sx={{ fontSize: 'inherit', marginRight: 1 }} />
                Add Order
            </Typography>


            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 1500, width: '100%' }}>
                    <Grid container spacing={2} >
                        
                    <TextField 
                        id='order-notes'
                        label="Order Comments"
                        multiline
                        fullWidth
                        value = {orderNote}
                        placeholder='Order Comments'
                        onChange={(event) => {
                            setOrderNote(event.target.value)}
                        }

                        />
                        <Grid item xs={4} sx={styleConstants.fieldSpacing}>
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

                        <Grid item xs={2} sx={styleConstants.fieldSpacing}>
                            <Button
                                variant="contained"
                                sx={{ height: '100%' }}
                                color="primary"
                                onClick={() => setShowAddCustomer(!showAddCustomer)}>
                                {showAddCustomer ? 'Hide Customer Form' : (
                                    <>
                                        <PersonAddIcon/>
                                        {'New Customer'}
                                    </>
                                )}
                            </Button>
                        </Grid>

                        <Grid item xs={4} sx={styleConstants.fieldSpacing}>
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

                        <Grid item xs={2} sx={styleConstants.fieldSpacing}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ height: '100%' }}
                                onClick={() => setShowAddressSearch(!showAddressSearch)}>
                                {showAddressSearch ? 'Hide Address Form' : (
                                    <>
                                    <AddLocationIcon />
                                    {'New Address'}</>
                                )}
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
              

            <ProductListForm sendProductList={setSelectedProducts}/>

            <Button
                type = "submit" 
                variant= {  selectedCustomer && selectedLocation && 
                            selectedProducts && selectedProducts.length > 0
                            ? "contained" : "disabled"}
                color="primary" 
                >
                                Submit Order
            </Button>

            </Paper>
        </Box>

        <Divider></Divider>



            <h2>All Orders</h2>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>

            <OrdersTable updateData={refreshOrders}/>
</Box>

            <Snackbar
                open={snackbar.open}
                anchorOrigin={{vertical:'top', horizontal: 'center'}}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>


        </div>
    );
};

export default AddOrder;
