import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Box, Paper, Grid, TextField, CircularProgress, Snackbar, Alert, Skeleton, selectClasses, Divider } from '@mui/material';
import ProductListForm from '../components/ProductListForm.jsx';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import { fetchCustomers, fetchLocations, postMethod } from '../store/apiFunctions.js';
import CancelIcon from '@mui/icons-material/Cancel';

const AddOrder = ({ updateOrders, closeModal, showMessage }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [orderNote, setOrderNote] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  useEffect(() => {
    loadCustomers();
    loadLocations();
  }, []);

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    const newCustomers = await fetchCustomers();
    setCustomers(newCustomers);
    setLoadingCustomers(false);
  };

  const loadLocations = async () => {
    setLoadingLocations(true);
    const newLocations = await fetchLocations();
    setLocations(newLocations);
    setLoadingLocations(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
  };

  const handleLocationChange = (event, newValue) => {
    setSelectedLocation(newValue);
  };

  const resetForm = () => {
    //setSelectedDate(dayjs()); don't reset for ease of adding multiple orders
    setOrderNote('');
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setSelectedLocation(null);
  };

  const handleSubmitAndClose = async (event ) =>{
    const success = await submitOrder(event);
    if (success) {
      showMessage('Order submitted successfully!', 'success');
      closeModal();
    }
  }

  const submitOrder = async (event) => {
    event.preventDefault(); // Prevent page refresh
    if (!selectedCustomer || !selectedLocation) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'error',
      });
      return;
    }
    if (selectedProducts.length === 0){
      setSnackbar({
        open: true,
        message: 'Please add products.',
        severity: 'error',
      });
      return;
    }

    const now = new Date().toISOString();

    const orderObject = {
      order: {
        dateOrdered: now,
        orderNotes: orderNote || 'No Note',
        customerId: selectedCustomer.id,
        locationId: selectedLocation.id,
        deliveryDate: selectedDate,
      },
      products: selectedProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
    };

    setSubmittingOrders(true);
    const result = await postMethod(orderObject, 'Orders');
    setSubmittingOrders(false);

    if (result != null) {
      updateOrders();
      setSnackbar({
        open: true,
        message: 'Order submitted successfully!',
        severity: 'success',
      });
      resetForm(); // Clear form after successful submission
      return true; // Success
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to submit order.',
        severity: 'error',
      });
      return false; // Fail
    }
  };


  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', maxHeight: '80vh' }}>
        <form onSubmit={submitOrder}> {/* Wrap everything in a form */}
          <Grid container spacing={0.5}>
            <Grid item xs={6} padding={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <DateTimePicker
                  tabIndex={1}
                  label="Date Required"
                  value={selectedDate}
                  onChange={handleDateChange}
                  size="small"
                  renderInput={(params) => <TextField required {...params} />
                  
                }
                />
              </LocalizationProvider>

              <Autocomplete
                tabIndex={2}
                disablePortal={false}
                id="Customers"
                size="small"
                options={customers || []}
                loading={loadingCustomers}
                getOptionLabel={(option) => `${option.name} ${option.phone}`}
                value={selectedCustomer}
                onChange={handleCustomerChange}
                renderInput={(params) => (
                  <TextField {...params} required label="Select Customer" />
                )}
                sx={{ mt: 1 }}
              />

              <Autocomplete
                tabIndex={3}
                disablePortal = {false} 
                id="Locations"
                size="small"
                options={locations || []}
                loading={loadingLocations}
                getOptionLabel={(option) => option.address + "," + option.description}
                value={selectedLocation}
                onChange={handleLocationChange}
                renderInput={(params) => (
                  <TextField {...params} required label="Select Location" />
                )}
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                tabIndex={5}
                label="Order Comments"
                multiline
                fullWidth
                rows={5}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </Grid>

            <ProductListForm tabIndex={4} addedProducts={selectedProducts} setAddedProducts={setSelectedProducts} />

            <Button
              tabIndex={6} 
              type="submit" 
              variant="contained" 
              disabled={submittingOrders}>
              Submit
              {submittingOrders && <CircularProgress size={18} />}
              {!submittingOrders && <SendIcon sx={{ marginLeft: 1 }} />}
            </Button>
            <Divider sx={{ marginX: 1 }} />
            <Button 
              tabIndex={7}
              type="submit" 
              variant="contained" 
              disabled={submittingOrders}
              onClick={handleSubmitAndClose}
              >
              Submit and Close
              {submittingOrders && <CircularProgress size={18} />}
              {!submittingOrders && <>
                <SendIcon sx={{ marginLeft: 1 }} /> 
                <CancelIcon sx={{marginLeft: 1}}/> 
                </>
                }
            </Button>
          </Grid>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default AddOrder;
