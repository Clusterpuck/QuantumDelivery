import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Grid, Paper, MenuItem, Snackbar, Alert } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from '@mui/x-data-grid';
import { postDeliveryRoutes, fetchMethod } from '../store/apiFunctions';
import MapWithPins from '../components/MapWithPins.jsx';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const styleConstants = {
  fieldSpacing: { mb: 4 }
};


// Page design for View Routes page
const ViewRoutes = ({ updateData }) =>
{
  const [selectedDate, setSelectedDate] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  //can change in future for backend to handle this
  const [allOrders, setAllOrders] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [numVehicles, setNumVehicles] = useState(1); // default to 1 vehicle
  const [ordersLoaded, setOrdersLoaded] = useState(false); // Track if orders are loaded


  // Function to handle date change and load dummy output
  const handleDateChange = (date) =>
  { // logic for showing orders from a specific date is still yet to be implemented.
    setSelectedDate(date);
    // Simulate sending date and input to a function to get the dummy output
    loadRoutes();
  };

  const handleSnackbarClose = () =>
  {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  const loadOrders = useCallback(async () =>
  {
    const orderList = await fetchMethod("orders");
    if (orderList)
    {
      setAllOrders(orderList);
      setOrdersLoaded(true); // Mark orders as loaded
    } else
    {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error'
      });
    }
  }, []);

  useEffect(() =>
  {

    loadOrders();

  }, [updateData, loadOrders])

  const loadRoutes = useCallback(async () =>
  {
    try
    {
      // using the dummy input to get route info from the database
      if (!ordersLoaded) return; // Do not load routes if orders are not loaded

      const userInput = {
        numVehicle: numVehicles,
        orders: allOrders.map(order => order.id) // Placeholder, adjust as needed
      };

      const routesList = await postDeliveryRoutes(userInput);
      if (routesList)
      {
        // Separate unassigned orders (vehicleId: 0) from assigned routes
        const unassigned = routesList.filter(route => route.vehicleId === 0);
        const assigned = routesList.filter(route => route.vehicleId !== 0);
        //console.log("Route object recieved is ", JSON.stringify(assigned));

        setUnassignedOrders(unassigned.flatMap(route => route.orders)); // Combine all unassigned orders
        setRoutes(assigned);
      }
      else
      {
        // throw error
        console.error('Error fetching delivery routes: ', error);
        setSnackbar({
          open: true,
          message: 'Failed to load orders',
          severity: 'error'
        });
      }
    } catch (error)
    {
      // catch error
      console.error('Error fetching delivery routes: ', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error'
      });
    }
  }, [numVehicles, allOrders]);

  useEffect(() =>
  {

    loadRoutes();

  }, [updateData, loadRoutes])

  // Define columns for DataGrid
  const columns = [
    { field: 'orderId', headerName: 'Order ID', width: 90 },
    //{ field: 'lat', headerName: 'Latitude', width: 150 },
    //{ field: 'long', headerName: 'Longitude', width: 150 },
    { field: 'addr', headerName: 'Address', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'prodNames', headerName: 'Product Names', width: 500, renderCell: (params) => params.value.join(', '
      )
    },
    { field: 'customerName', headerName: 'Customer Name', width: 150 }

  ];

  const handleNumVehiclesChange = (event) =>
  {
    setNumVehicles(event.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <h1>View Routes</h1>

      <Paper elevation={3} sx={{ padding: 3, maxWidth: 1500, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} container spacing={2} alignItems="center">
            <Grid item xs={6} md={6} >

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Plan Date"
                  inputFormat="MM/DD/YYYY"
                  //value={value}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />

              </LocalizationProvider>


            </Grid>
            {/* Dropdown for selecting number of vehicles and Regenerate button */}
            <Grid item xs={2}>
              <TextField
                select
                label="Number of Vehicles"
                value={numVehicles}
                onChange={handleNumVehiclesChange}
                fullWidth
              >
                {[...Array(10).keys()].map(i => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end">
              <Button
                variant='contained'
                onClick={loadRoutes} // Call loadRoutes on button click
              >
                Regenerate Routes
              </Button>
            </Grid>
          </Grid>



          <Grid xs={6}>
            {/* <Button
              variant='contained'
              onClick={loadOrders}
            >
              Plan Routes
            </Button> */}

          </Grid>

          {/* Render unassigned orders */}
          {unassignedOrders.length > 0 && (
            <Grid item xs={12}>
              <h3>Unassigned</h3>
              <DataGrid
                rows={unassignedOrders.map((order, idx) => ({ id: order.orderId, ...order }))}
                columns={columns}
                pageSize={5}
                autoHeight
              />
            </Grid>
          )}

          {/* Render assigned vehicles */}
          {routes.map((vehicle, index) => (
            <Grid item xs={12} key={vehicle.vehicleId} sx={styleConstants.fieldSpacing}>
              <Divider>
                <Typography variant="h4" component="h3" align="center">
                  Vehicle {vehicle.vehicleId}
                </Typography>
              </Divider>
              <Grid item sx={styleConstants.fieldSpacing}>
                <DataGrid
                  rows={vehicle.orders.map((order, idx) => ({ id: order.orderId, ...order }))}
                  columns={columns}
                  pageSize={5}
                  autoHeight
                />
                <MapWithPins inputLocations={vehicle.orders.map(order => ({
                  latitude: order.lat,
                  longitude: order.lon
                }))} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>


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

export default ViewRoutes;
