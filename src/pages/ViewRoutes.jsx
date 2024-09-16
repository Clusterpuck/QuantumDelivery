import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Grid, Paper, MenuItem, Snackbar, Alert } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from '@mui/x-data-grid';
import { postDeliveryRoutes, fetchMethod, deleteMethod } from '../store/apiFunctions';
import MapWithPins from '../components/MapWithPins.jsx';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import RouteIcon from '@mui/icons-material/Route';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import {enableScroll} from '../assets/scroll.js';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OrdersTable from '../components/OrdersTable.jsx';
import {formatDate} from '../store/helperFunctions';

const styleConstants = {
  fieldSpacing: { mb: 4 }
};


// Page design for View Routes page
const ViewRoutes = ( ) =>
{
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [routes, setRoutes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  //can change in future for backend to handle this
  const [allOrders, setAllOrders] = useState([]);
  const [plannedOrders, setPlannedOrders] = useState([]);
  const [numVehicles, setNumVehicles] = useState(1); // default to 1 vehicle
  const [ordersLoaded, setOrdersLoaded] = useState(false); // Track if orders are loaded
  const [calcType, setCalcType] = useState("brute");

  
  useEffect(() =>
    {
      enableScroll();
      loadOrders();
      loadRoutes();
  
    }, [])

  // Function to handle date change and load dummy output
  const handleDateChange = (date) =>
  { // logic for showing orders from a specific date is still yet to be implemented.
    setSelectedDate(date);
    // Simulate sending date and input to a function to get the dummy output
    //loadRoutes();
  };


  /**
   * Handles the selector changing calc type between brute and quantum
   *
   * @param {*} event
   */
  const handleCalcChange = (event) => {
    setCalcType(event.target.value)
    console.log("Calc changed to ", event.target.value );

  }


  const handleSnackbarClose = () =>
  {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  const calcRoutes = async () => {
    try
    {
      // using the dummy input to get route info from the database
      if (!ordersLoaded) return; // Do not load routes if orders are not loaded

      const userInput = {
        numVehicle: numVehicles,
        calcType: calcType,
        deliveryDate: selectedDate,
        orders: plannedOrders.
        map(order => order.orderID) // all orders
      };

      console.log("Payload being sent: ", JSON.stringify(userInput));
      const unsortedRoutesList = await postDeliveryRoutes(userInput);
      if (unsortedRoutesList)
      {
        const routesList = unsortedRoutesList.sort((a, b) => a.position - b.position);
        setRoutes(routesList);
        loadOrders();

      }
      else
      {
        // throw error
        console.error('Error fetching delivery routes: ', error);
        setSnackbar({
          open: true,
          message: 'Failed to load delivery routes',
          severity: 'error'
        });
      }
    } catch (error)
    {
      // catch error
      console.error('Error fetching delivery routes: ', error);
      setSnackbar({
        open: true,
        message: 'Failed to load delivery routes',
        severity: 'error'
      });
    }

  }


  const loadOrders = async () =>
  {
    const ordersList = await fetchMethod("orders");
    if (ordersList)
    {
      console.log("Order list is " + JSON.stringify(ordersList));
      const sortedOrderList = ordersList.sort((a, b) => a.position - b.position);
      setAllOrders(sortedOrderList);
      const unassingedOrders = sortedOrderList.filter( order => order.status === "PLANNED");
      setPlannedOrders(unassingedOrders);
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
  };


  const deleteRoute = async (id) =>
  {
    console.log("id sent to delete is " + id);
    const result = await deleteMethod(id, 'DeliveryRoutes');
    if (result)
    {
      console.log('Item deleted successfully:', result);
      await loadOrders();
      await loadRoutes();
    } else
    {
      console.log('Failed to delete item.');
    }

  }


  const loadRoutes = async () =>
  {//need to update get route to manage getting existing orders
    //should return the same as CalcRoute
    try
    {
      const routesList = await fetchMethod('DeliveryRoutes');
      if (routesList)
      {
        setRoutes(routesList);
      }
      else
      {
        // throw error
        console.error('Error fetching delivery routes: ', error);
        setSnackbar({
          open: true,
          message: 'Failed to load delivery routes',
          severity: 'error'
        });
      }
    } catch (error)
    {
      // catch error
      console.error('Error fetching delivery routes: ', error);
      setSnackbar({
        open: true,
        message: 'Failed to load delivery routes',
        severity: 'error'
      });
    }
  };

  // Define columns for DataGrid
  const columns = [
    { field: 'orderID', headerName: 'Order ID', width: 90 },
    { field: 'deliveryDate', headerName: 'Delivery Date', width: 100, renderCell: (params) => formatDate(params.value) },
    { field: 'position', headerName: 'Position', width: 90},
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 150 },
    { field: 'productNames', headerName: 'Product Names', width: 500, renderCell: (params) => params.value.join(', ') },

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

      <Typography variant="h2" component="h1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RouteIcon sx={{ fontSize: 'inherit', marginRight: 1 }} />
        View Routes
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, maxWidth: 1500, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} container spacing={2} alignItems="center">
            <Grid item xs={6} md={3} >

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Plan Date"
                  inputFormat="MM/DD/YYYY"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params}/>}
                />

              </LocalizationProvider>


            </Grid>
            {/* Dropdown for selecting number of vehicles and Regenerate button */}
            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Number of Vehicles"
                value={numVehicles}
                fullWidth
                onChange={handleNumVehiclesChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalShippingIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {[...Array(10).keys()].map(i => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
                </Grid>
              <Grid item xs={6} md={3}>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={calcType}
                  onChange={handleCalcChange}
                >
                  <FormControlLabel value="brute" control={<Radio />} label="Brute Force" />
                  <FormControlLabel value="dwave" control={<Radio />} label="Quantum Computer" />
                </RadioGroup>
              </Grid>
            <Grid item xs={6} md={4} container justifyContent="flex-end">
              <Button
                variant='contained'
                sx={{ height: '100%' }}
                onClick={calcRoutes} // Call loadRoutes on button click
              >
                <AltRouteIcon />
                Regenerate Routes
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} container spacing={2} alignItems="center">
            <Accordion style={{ width: '100%' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {plannedOrders ? <p>Unassigned Orders {plannedOrders.length}</p> : <p>No Unassigned Orders</p>}
              </AccordionSummary>
              <AccordionDetails>
                <OrdersTable updateData={false} filterBy={['PLANNED']}/>
              </AccordionDetails>
            </Accordion>
          </Grid>


          <Grid xs={6}>
          
          </Grid>

         
          {/* Render assigned vehicles */}
          {routes.map((route) => (
            <Grid item xs={12} key={route.vehicleId} sx={styleConstants.fieldSpacing}>
              <Divider>
                <Typography variant="h4" component="h3" align="center">
                  Vehicle {route.vehicleId}
                </Typography>
              </Divider>
              <Grid item sx={styleConstants.fieldSpacing}>
                <DataGrid
                  rows={route.orders
                    .slice() // Copy to avoid mutating original array
                    .sort((a, b) => a.position - b.position) // Sort by position
                    .map((order) => ({ id: order.orderID, ...order }))}
                  columns={columns}
                  pageSize={5}
                  autoHeight
                />
                 {route.orders && route.orders.length > 0 ? (
                  <>
                    <MapWithPins
                      inputLocations={route.orders
                      .slice() // Copy to avoid mutating the original array
                      .sort((a, b) => a.position - b.position) // Sort by position
                      .map(order => ({
                      latitude: order.latitude,
                      longitude: order.longitude
                      }))}
                    />
                  </>
                ) : (
                  <p>No Orders</p>
                )}
                <Button
                  onClick={()=>deleteRoute(route.deliveryRouteID)}
                  color = "error"
                  variant = "contained"
                >Delete Route</Button>
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
