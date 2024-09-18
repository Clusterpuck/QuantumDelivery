import React, { useEffect, useState } from 'react';
import { fetchCustomers, fetchLocations, postMethod } from '../store/apiFunctions.js';
import { Autocomplete, Button, Box, Paper, Grid, TextField, Snackbar, Alert, Divider, CircularProgress } from '@mui/material';
import AddressSearch from '../components/AddressSearch.jsx';
import AddCustomer from '../components/AddCustomer.jsx';
import ProductListForm from '../components/ProductListForm.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchMethod } from '../store/apiFunctions';
import { DateTimePicker } from '@mui/x-date-pickers';
import Skeleton from '@mui/material/Skeleton';

const styleConstants = {
    fieldSpacing: { mb: 2 }
};

const AddOrder = () => {
    const [customers, setCustomers] = useState(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [locations, setLocations] = useState(null);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(0);
    const [submittingOrders, setSubmittingOrders] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [snackbar, setSnackbar] = useState({

        open: false,
        message: '',
        severity: 'success',
    });
    const [selectedDate, setSelectedDate] = useState(dayjs());


    useEffect(() => {

        loadOrders();
        loadCustomers();
        loadLocations();
        
    }, []);

    const handleCustomerChange = (event, newValue) => {
        setSelectedCustomer(newValue);
        //console.log("Selected customer is  " + selectedCustomer.name);
    };

    const handleLocationChange = (event, newValue) => {
        setSelectedLocation(newValue);
        //console.log("Selected location is  " + selectedLocation.address);
    };

    const loadCustomers = async () => {
        setLoadingCustomers(true);
        const newCustomers = await fetchCustomers();
        setCustomers(newCustomers);
        setLoadingCustomers(false);

    }

    const loadLocations = async () => {
        setLoadingLocations(true);
        const newLocations = await fetchLocations();
        setLocations(newLocations);
        setLoadingLocations(false);

    }

    const loadOrders = async () => {
        setLoadingOrders(true);
        const loadOrders = await fetchMethod("orders");
        if (loadOrders) {
        const filteredOrders = loadOrders.filter(order => order.status !== "CANCELLED");
        setOrders(filteredOrders);
        console.log("Orders recieved are ", JSON.stringify(filteredOrders));
        } else {
            console.error('Error fetching orders:', error);
            setSnackbarMessage('Failed to load orders');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        setLoadingOrders(false);
    }

    const handleCustomerFormClose = async (newCustomer) => {
        setShowAddCustomer(false);
        setLoadingCustomers(true);
        const reloadedCustomers = await fetchCustomers();
        setLoadingCustomers(false);
        setCustomers(reloadedCustomers);
        //setSelectedCustomer(newCustomer);   
    };

    const handleAddressFormClose = async () => {
        setShowAddressSearch(false);
        setLoadingLocations(true);
        const newAddress = await fetchLocations();
        setLoadingLocations(false);
        setLocations(newAddress);
    };

    
  // Function to handle date change and load dummy output
  const handleDateChange = (date) =>
    { // logic for showing orders from a specific date is still yet to be implemented.
      setSelectedDate(date);
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
        if(result!= null )
        {
            //refresh the table
            loadOrders();
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

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const LocationAutocomplete = () => {
          
          
        if (loadingLocations) {
          return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }
      
        if (locations)
        {
            return (
                <Autocomplete
                    disablePortal
                    id="Locations"
                    options={locations}
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
      
      const commonStyles = {
        width: '100%',  // Make it responsive to parent container
        maxWidth: 400,  // Set a max width to keep it from expanding too much
        height: 'auto', // Auto-adjust height for responsiveness
      };
      const skeletonStyles = {
        ...commonStyles,
        height: 56,  // Set a fixed height for the skeleton to simulate the input field height
      };

   



    const CustomerAutocomplete = () => {
          
          
        if (loadingCustomers) {
          return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }
      
        if (customers) {
          return (
            <Autocomplete
              disablePortal
              id="Customers"
              options={customers}
              getOptionLabel={(option) => option.name + " " + option.phone}
              getOptionKey={(option) => option.id}
              sx={commonStyles}
              value= {selectedCustomer}
              onChange={handleCustomerChange}
              renderInput={(params) => <TextField {...params} label="Select Customer" />}
            />
          );
        }
      
       // return <p>No Customers</p>;
      };


    return (
        <div
           
        >
            <Typography variant="h3" component="h1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LibraryAddIcon sx={{ fontSize: 'inherit', marginRight: 1 }} />
                Add Order
            </Typography>


            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 1500, width: '100%' }}>
                    <Grid item xs={12} md= {12} container spacing={2} >
                    <Grid item xs={6} md= {6} container spacing={2} >

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                <DateTimePicker
                  label="Date Required"
                  //inputFormat="DD/MM/YYYY"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params}/>}
                />

              </LocalizationProvider>
              </Grid>
              <Grid item xs={6} md= {6} container spacing={2} >

                        
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
                    </Grid>
                        <Grid item xs={4} sx={styleConstants.fieldSpacing}>
                            <CustomerAutocomplete />
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
                            <LocationAutocomplete />
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
                onClick={submitOrder}
                sx={{ height: 40 }} // Set a fixed height for the button
                >
                Submit Order
                {submittingOrders? <CircularProgress size={18} color='secondary' x={{ marginLeft: 1 }}/> : <SendIcon sx={{ marginLeft: 1 }}/>}
                    
            </Button>

            </Paper>
        </Box>

        <Divider></Divider>



            <h2>All Orders</h2>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
                    <Box sx={{ height: 400, width: '100%', mt: 2 }}>

                        {loadingOrders ? 
                            (<Skeleton variant="rectangular" animation="wave" sx={{height: '100%'}} />) : 
                            (<OrdersTable orders={orders} />)}
                    </Box>
                </Paper>
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


        </div>
    );
};

export default AddOrder;
