// React and Date Handling
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// Material-UI Components
import
  {
    TextField, Button, Grid, Paper, MenuItem, Snackbar,
    Alert, Divider, Typography, InputAdornment, Radio, RadioGroup,
    FormControlLabel, Accordion, AccordionDetails, AccordionSummary, LinearProgress, CircularProgress
  } from '@mui/material';

// Material-UI Icons
import RouteIcon from '@mui/icons-material/Route';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Date Picker
import DateSelectHighlight from '../components/DateSelectHighlight.jsx';

// Data Grid
import { DataGrid } from '@mui/x-data-grid';

// Local Imports
import MapWithPins from '../components/MapWithPins.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import { postDeliveryRoutes, fetchMethod, deleteMethod } from '../store/apiFunctions';
import { formatDate } from '../store/helperFunctions';
import CustomLoading from '../components/CustomLoading.jsx';
import { enableScroll } from '../assets/scroll.js';


const styleConstants = {
  fieldSpacing: { mb: 4 }
};


// Page design for View Routes page
const ViewRoutes = () =>
{
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [unassignedDates, setUnassignedDates] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [plannedOrders, setPlannedOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false); // Track if orders are loaded
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  //can change in future for backend to handle this
  const [datePlannedOrders, setDatePlannedOrders] = useState([]);
  const [numVehicles, setNumVehicles] = useState(1); // default to 1 vehicle
  const [calcType, setCalcType] = useState("brute");

  // Depot handling
  const [selectedDepot, setSelectedDepot] = useState('');



  useEffect(() =>
  {
    enableScroll();
    loadOrders();
    loadRoutes();

  }, [])

  useEffect(() =>
  {
    if (plannedOrders && selectedDate)
    {
      filterByDate(selectedDate);
    }
  }, [plannedOrders, selectedDate]);



  /**
   * Function to handle date change and load dummy output
   *
   * @param {*} date
   */
  const handleDateChange = (date) =>
  {
    setSelectedDate(date);
    //filter orders by new date
    filterByDate(date);
  };



  /** Forms a list of current dates that there are routes planned */
  function extractOrderDates(inOrders)
  {
    const newDateList = [];

    // Iterate over routes and orders, but only add unique dates
    inOrders.forEach(order =>
    {
      const routeDate = dayjs(order.deliveryDate);

      // Check if the same day, month, and year already exists in newDateList
      const isDuplicate = newDateList.some(
        date => dayjs(date).isSame(routeDate, 'day')
      );

      // Add to list if it's not a duplicate
      if (!isDuplicate)
      {
        newDateList.push(order.deliveryDate);
      }
    });

    setUnassignedDates(newDateList);

  }



  /**
   * Filters all the orders that are planned to only orders
   * in the selected date. 
   *
   * @param {*} newDate
   */
  function filterByDate(newDate)
  {
    const selectedDateFormatted = newDate.startOf('day');
    const filteredOrders = plannedOrders.filter(order =>
    {
      const orderDeliverDate = dayjs(order.deliveryDate).startOf('day');
      return orderDeliverDate.isSame(selectedDateFormatted);
    });
    //console.log("xxXXFiltered orders is ", JSON.stringify(filteredOrders));

    setDatePlannedOrders(filteredOrders); // Save the date-filtered orders

  }


  /**
   * Handles the selector changing calc type between brute and quantum
   *
   * @param {*} event
   */
  const handleCalcChange = (event) =>
  {
    setCalcType(event.target.value)
   // console.log("Calc changed to ", event.target.value);

  }



  /** Deals with user requesting closing the snackbar */
  const handleSnackbarClose = () =>
  {
    setSnackbar(prev => ({ ...prev, open: false }));
  };



  /**
   * If orders are loaded and the datePlanned orders are defined and have values
   * Meaning there are orders that aren't assigned on the selected date
   * A request with those orders are sent to determine the routes
   * Runs load orders if routes are calculated correctly. 
   *
   * @async
   * @returns {*}
   */
  const calcRoutes = async () =>
  {
    try
    {
      setRoutesLoading(true);
      if (!datePlannedOrders) return; // Do not load routes if orders are not loaded
      if (!datePlannedOrders || datePlannedOrders.length == 0) return;
      const userInput = {
        numVehicle: numVehicles,
        calcType: calcType,
        deliveryDate: selectedDate,
        orders: datePlannedOrders.
          map(order => order.orderID) // all orders
      };

      //console.log("Payload being sent: ", JSON.stringify(userInput));
      await postDeliveryRoutes(userInput);
      //needs to return all routes, not just new routes
      await loadRoutes();
      //send instead of relying on set due to asynch setting
      //resets order list after them being assigned to routes
      await loadOrders();

    } catch (error)
    {
      // catch error
      console.error('Error fetching delivery routes: ', error);
      setSnackbar({
        open: true,
        message: 'Failed to load delivery routes',
        severity: 'error'
      });
    } finally
    {
      setRoutesLoading(false);
    }

  }


  /**
   * Load orders then sort by position number
   * and filter to planned only 
   *
   * @async
   * @returns {*}
   */
  const loadOrders = async () =>
  {
    setOrdersLoading(true);
    const ordersList = await fetchMethod("orders");
    if (ordersList)
    {

      //console.log("Order list is " + JSON.stringify(ordersList));
      const filteredOrders = ordersList.filter(order => order.status === "PLANNED");
      const sortedOrderList = filteredOrders.sort((a, b) => a.position - b.position);
      // Filter orders where the status is "PLANNED" and the DeliverDate matches the selected date
      // Filter orders where the status is "PLANNED" (initial fetch)
      setPlannedOrders(sortedOrderList);  // Save all planned orders
      // Filter the saved planned orders by the selected date
      filterByDate(selectedDate);
      extractOrderDates(filteredOrders);

    } else
    {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error'
      });
    }
    setOrdersLoading(false);
  };



  /**
   * Delete route send a route to be deleted by ID
   * Once sent, routes and orders are reloaded. 
   *
   * @async
   * @param {*} id
   * @returns {*}
   */
  const deleteRoute = async (id) =>
  {
    //console.log("id sent to delete is " + id);
    const result = await deleteMethod(id, 'DeliveryRoutes');
    if (result)
    {
      //console.log('Item deleted successfully:', result);
      await loadOrders();
      await loadRoutes();
    } else
    {
      console.error('Failed to delete item.');
    }

  }


  /**
   * Loads all the routes in the database
   * Into the state values routes
   *
   * @async
   * @returns {unknown}
   */
  const loadRoutes = async () =>
  {//need to update get route to manage getting existing orders
    //should return the same as CalcRoute
    setRoutesLoading(true);
    try
    {
      const routesList = await fetchMethod('DeliveryRoutes');
      if (routesList)
      {
        //console.log("xxXX Route List is " + JSON.stringify(routesList));
        //setRoutes(routesList);
        const groupedRoutes = routesList.reduce((acc, route) =>
        {
          const deliveryDate = new Date(route.deliveryDate).toDateString(); // Convert to string (ignoring time)

          // Check if this date already exists in the accumulator
          if (!acc[deliveryDate])
          {
            acc[deliveryDate] = []; // Initialize array if it doesn't exist
          }

          acc[deliveryDate].push(route); // Add route to the relevant date group
          return acc;
        }, {});

        setRoutes(groupedRoutes)
        //console.log("xxXXGrouped Routes by Date: ", groupedRoutes);
        return groupedRoutes;
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
    finally{
      setRoutesLoading(false);
    }
  };


  // Define columns for DataGrid
  const columns = [
    { field: 'orderID', headerName: 'Order ID', width: 90 },
    { field: 'deliveryDate', headerName: 'Delivery Date', width: 100, renderCell: (params) => formatDate(params.value) },
    { field: 'position', headerName: 'Position', width: 90 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 150 },
    { field: 'productNames', headerName: 'Product Names', width: 500, renderCell: (params) => params.value.join(', ') },

  ];


  /**
   * Handle num vehicles change
   * sets the drop down value for vehicles
   *
   * @param {*} event
   */
  const handleNumVehiclesChange = (event) =>
  {
    setNumVehicles(event.target.value);
  };

  // Temp Code
  const depots = [
    { id: 1, name: "Depot A" },
    { id: 2, name: "Depot B" },
    { id: 3, name: "Depot C" },
    { id: 4, name: "Depot D" },
  ];

  const handleDepotChange = (event) => {
    setSelectedDepot(event.target.value);
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
        Routes
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, maxWidth: 1500, width: '100%' }}>
        <Grid item xs={12} md={12} container spacing={2}>
          <Grid item xs={12} md={12} container spacing={2} alignItems="center">
            <Grid item xs={6} md={3} >
              {ordersLoading ? <CircularProgress/> :

              <DateSelectHighlight highlightedDates={unassignedDates} selectedDate={selectedDate} handleDateChange={handleDateChange} />
              }
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
            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Depot"
                value={selectedDepot}
                fullWidth
                onChange={handleDepotChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalShippingIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {depots.map(depot => (
                  <MenuItem key={depot.id} value={depot.id}>
                    {depot.name}
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
            <Grid item xs={6} md={2} container justifyContent="flex-end">
              {routesLoading ? (
                <Button
                  variant='contained'
                  color='secondary'
                  sx={{ height: '100%' }}
                >
                  <CustomLoading />
                </Button>
              ) : (
                <Button
                  disabled={datePlannedOrders?.length == 0}
                  variant='contained'
                  sx={{ height: '100%' }}
                  onClick={calcRoutes} // Call loadRoutes on button click
                >

                  <AltRouteIcon />

                  Regenerate Routes
                </Button>
              )}
            </Grid>
          </Grid>

          {/* unassigned orders component */}
          <Grid item xs={12} md={12} container spacing={2} alignItems="center" maxWidth='1200px'>
          {ordersLoading ? <LinearProgress/> :
          (
            <Accordion sx={{width: '100%'}} >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-content`}
                id={`panel-header`}
                sx={{
                  backgroundColor: 'lightblue',  // Set background color
                  borderBottom: '1px solid grey', // Add a border
                 
                  '&:hover': {
                    backgroundColor: 'teal', // Hover effect
                  },
                  '& .MuiTypography-root': {
                    fontWeight: 'bold', // Custom font styles for text
                    color: '#333', // Change text color
                  },
                }}
              >
               

                    {plannedOrders ? (
                      <>
                      <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={10}>
                      <Typography variant="h6">
                        Unassigned Orders: {datePlannedOrders.length}
                      </Typography>
                      <Typography variant="h7">
                        Date: {formatDate(selectedDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                        </>
                    ) : (
                      <Typography variant="body1" color="textSecondary">
                        No Unassigned Orders
                      </Typography>
                    )}

              </AccordionSummary>
              <AccordionDetails>
                <OrdersTable orders={datePlannedOrders} />
              </AccordionDetails>
            </Accordion>
          )}
          </Grid>


          <Grid item xs={12} md={12} container spacing={2} alignItems="center" maxWidth='1200px'>
            {routesLoading ? ( <LinearProgress color='primary' sx={{ width: '100%' }} />) : (
              <>
            
            {/* Render assigned vehicles */}
            {Object.entries(routes).map(([date, dateRoutes]) => (
              <Grid item xs={12} md={12} container spacing={2} alignItems="center" maxWidth='1200px'>
              <Accordion key={date}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${date}-content`}
                  id={`panel-${date}-header`}
                  sx={{
                    backgroundColor: 'lightblue',  // Set background color
                    borderBottom: '1px solid grey', // Add a border
                    '&:hover': {
                      backgroundColor: 'teal', // Hover effect
                    },
                    '& .MuiTypography-root': {
                      fontWeight: 'bold', // Custom font styles for text
                      color: '#333', // Change text color
                    },
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={10}>
                      <Typography variant="h7">
                        Delivery Date: {date}
                      </Typography>
                      <Typography variant="subtitle1">
                        Total Routes: {dateRoutes.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  {dateRoutes.map((route) => (
                    <>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={10}>
                          <Typography>
                            ID: {route.deliveryRouteID} &nbsp;
                            Vehicle: {route.vehicleId} &nbsp;
                            Orders: {route.orders.length} &nbsp;
                            Date: {formatDate(route.deliveryDate)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            onClick={() => deleteRoute(route.deliveryRouteID)}
                            color="error"
                            variant="contained"
                          >
                            Delete Route
                          </Button>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing}>
                        <Divider>
                          <Typography variant="h4" component="h3" align="center">
                            Vehicle {route.vehicleId}
                          </Typography>
                        </Divider>

                        {/* DataGrid for orders */}
                        <Grid item xs={12} md={12} sx={styleConstants.fieldSpacing}>
                          <DataGrid
                            rows={route.orders
                              .slice()
                              .sort((a, b) => a.position - b.position)
                              .map((order) => ({ id: order.orderID, ...order }))}
                            columns={columns}
                            pageSize={5}
                            autoHeight
                          />

                          {/* Map for orders */}
                          {route.orders && route.orders.length > 0 ? (
                            <>
                              <MapWithPins
                                inputLocations={route.orders
                                  .slice()
                                  .sort((a, b) => a.position - b.position)
                                  .map((order) => ({
                                    latitude: order.latitude,
                                    longitude: order.longitude,
                                  }))}
                              />
                            </>
                          ) : (
                            <p>No Orders</p>
                          )}
                        </Grid>
                      </Grid>
                    </>
                  ))}
                </AccordionDetails>
              </Accordion>
              </Grid>
            ))}
            </>
            )}
          </Grid>

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
