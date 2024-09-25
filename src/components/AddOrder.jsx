import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Box, Paper, Grid, TextField, CircularProgress, Snackbar, Alert, Skeleton } from '@mui/material';
import ProductListForm from '../components/ProductListForm.jsx';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import { fetchCustomers, fetchLocations, postMethod } from '../store/apiFunctions.js';


const AddOrder = ({ updateOrders }) =>
{
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [orderNote, setOrderNote] = useState('');
    const [selectedProducts, setSelectedProducts] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [submittingOrders, setSubmittingOrders] = useState(false);
    const [customers, setCustomers] = useState(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [locations, setLocations] = useState(null);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const commonStyles = {
        width: '100%',  // Make it responsive to parent container
        maxWidth: 800,  // Set a max width to keep it from expanding too much
        height: 'auto', // Auto-adjust height for responsiveness
    };

    const skeletonStyles = {
        ...commonStyles,
        height: 56,  // Set a fixed height for the skeleton to simulate the input field height
    };

    
const styleConstants = {
    fieldSpacing: { mb: 0.5 }
};


    useEffect(() =>
    {
        loadCustomers();
        loadLocations();

    }, []);

    const loadCustomers = async () =>
    {
        setLoadingCustomers(true);
        const newCustomers = await fetchCustomers();
        setCustomers(newCustomers);
        setLoadingCustomers(false);

    }

    const loadLocations = async () =>
    {
        setLoadingLocations(true);
        const newLocations = await fetchLocations();
        setLocations(newLocations);
        setLoadingLocations(false);

    }

    const handleSnackbarClose = () =>
    {
        setSnackbar(prev => ({ ...prev, open: false }));
    };


    // Function to handle date change and load dummy output
    const handleDateChange = (date) =>
    { // logic for showing orders from a specific date is still yet to be implemented.
        setSelectedDate(date);
    };

    const handleCustomerChange = (event, newValue) =>
    {
        setSelectedCustomer(newValue);
        //console.log("Selected customer is  " + selectedCustomer.name);
    };

    const handleLocationChange = (event, newValue) =>
    {
        setSelectedLocation(newValue);
        //console.log("Selected location is  " + selectedLocation.address);
    };


    const submitOrder = async (event) =>
    {
        event.preventDefault();
        if (!selectedCustomer || !selectedLocation || selectedProducts.length === 0)
        {
            setSnackbar({
                open: true,
                message: 'Please fill in all required fields.',
                severity: 'error',
            });
            return;
        }

        console.log('Submitting order: customerObject ', JSON.stringify(selectedCustomer))
        console.log('locationObject ', JSON.stringify(selectedLocation))
        console.log('productlist :', JSON.stringify(selectedProducts))

        const now = new Date().toISOString();  // Get the current date in ISO format

        const orderObject = {
            order: {
                dateOrdered: now,
                orderNotes: orderNote ? orderNote : "No Note",  // You can replace this with actual notes if needed
                customerId: selectedCustomer.id,
                locationId: selectedLocation.id,
                deliveryDate: selectedDate,
            },
            products: selectedProducts.map(product => ({
                productId: product.id,
                quantity: product.quantity
            }))
        };

        console.log('Order object to send is ', JSON.stringify(orderObject))
        setSubmittingOrders(true);
        const result = await postMethod(orderObject, 'Orders');
        setSubmittingOrders(false);
        if (result != null)
        {
            //refresh the table
            updateOrders();
            console.log("Orders recieved are ", JSON.stringify(result));
            setSnackbar({
                open: true,
                message: 'Order submitted successfully!',
                severity: 'success',
            });

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


    const CustomerAutocomplete = () =>
    {


        if (loadingCustomers)
        {
            return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }

        if (customers)
        {
            return (
                <Autocomplete
                    disablePortal
                    id="Customers"
                    size="small"
                    options={customers}
                    getOptionLabel={(option) => option.name + " " + option.phone}
                    getOptionKey={(option) => option.id}
                    sx={commonStyles}
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                    renderInput={(params) => <TextField {...params} label="Select Customer" />}
                />
            );
        }

        // return <p>No Customers</p>;
    };


    const LocationAutocomplete = () =>
    {


        if (loadingLocations)
        {
            return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }

        if (locations)
        {
            return (
                <Autocomplete
                    disablePortal
                    id="Locations"
                    options={locations}
                    size="small"
                    getOptionLabel={(option) => option.address}
                    getOptionKey={(option) => option.id}
                    sx={commonStyles}
                    onChange={handleLocationChange}
                    value={selectedLocation}
                    renderInput={(params) => <TextField {...params} label="Select Location" />}
                />
            );
        }

        // return <p>No Customers</p>;
    };

   



    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', maxHeight: '80vh' }}>
                    <Grid item xs={12} md={12} container spacing={0.5} >
                        <Grid item xs={6} md={6} sx={styleConstants.fieldSpacing} >

                            <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing}>

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                                    <DateTimePicker
                                        sx={commonStyles}
                                        label="Date Required"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        size="small"
                                        renderInput={(params) => <TextField {...params} />}
                                    />

                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing}>
                                <CustomerAutocomplete />
                            </Grid>

                            <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing}>
                                <LocationAutocomplete />
                            </Grid>
                        </Grid>

                        <Grid item xs={6} md={6} sx={styleConstants.fieldSpacing} >

                            <TextField
                                id='order-notes'
                                label="Order Comments"
                                multiline
                                fullWidth
                                rows={5}
                                value={orderNote}
                                placeholder='Order Comments'
                                size="small"
                                onChange={(event) =>
                                {
                                    setOrderNote(event.target.value)
                                }
                                }

                            />
                        </Grid>

                        <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing} >

                            <ProductListForm sendProductList={setSelectedProducts} />

                        </Grid>
                        <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing} >

                            <Button
                                type="submit"
                                variant={selectedCustomer && selectedLocation &&
                                    selectedProducts && selectedProducts.length > 0

                                    ? "contained" : "disabled"}
                                color="primary"
                                onClick={submitOrder}
                                sx={{ height: 30 }} // Set a fixed height for the button
                            >
                                Submit Order
                                {submittingOrders ? <CircularProgress size={18} color='secondary' x={{ marginLeft: 1 }} /> : <SendIcon sx={{ marginLeft: 1 }} />}

                            </Button>
                        </Grid>
                    </Grid>
            </Box>
            <Snackbar
                open={snackbar.open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );

}

export default AddOrder;