// React and Date Handling
import React, { useState, useEffect } from 'react';
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Vehicle Icon
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"; // Orders Icon
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Date Icon
import LabelIcon from "@mui/icons-material/Label"; // ID Icon
import AddIcon from '@mui/icons-material/Add'; // Add Icon
import { useTheme } from '@mui/material/styles';
import AddRouteForm from '../components/AddRouteForm.jsx';
import CancelIcon from '@mui/icons-material/Cancel';
import EditRouteForm from '../components/EditRouteForm';
import PersonIcon from '@mui/icons-material/Person'; // person icon
import { Switch } from '@mui/material';

// Material-UI Components
import
  {
    Button, Grid, Paper, Snackbar,
    Alert, Typography, Accordion, AccordionDetails, AccordionSummary,
    Box, Skeleton, Modal, Dialog, Tooltip
  } from '@mui/material';

// Material-UI Icons
import RouteIcon from '@mui/icons-material/Route';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// Data Grid
import { DataGrid } from '@mui/x-data-grid';

// Local Imports
import MapWithPins from '../components/MapWithPins.jsx';
import { fetchMethod, deleteMethod } from '../store/apiFunctions';
import { formatDate } from '../store/helperFunctions';
import { enableScroll } from '../assets/scroll.js';
import { deleteRouteByDate } from '../store/apiFunctions.js'


const styleConstants = {
  fieldSpacing: { mb: 4 }
};


// Page design for View Routes page
const ViewRoutes = () =>
{
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  // for if an edit route dialog is open
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRouteToEdit, setSelectedRouteToEdit] = useState(false);
  const [isActiveRoutes, setIsActiveRoutes] = useState(true);

  // State for controlling Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();


  // Modal Style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '80%',
    overflowY: 'auto',
  };


  useEffect(() =>
  {
    enableScroll();
    loadRoutes();

  }, []);

  useEffect(() =>
  {
    loadRoutes();
  }, [isActiveRoutes]);

  const handleShowMessage = (msg, type) =>
  {
    setSnackbar({
      open: true,
      message: msg,
      severity: type
    });
  };

  // Function to handle switch toggle
  const handleToggle = (event) =>
  {
    setIsActiveRoutes(event.target.checked);
  };

  // Open Modal function
  const handleOpenModal = () => setIsModalOpen(true);

  // Close Modal function
  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditClick = (route) =>
  {
    setSelectedRouteToEdit(route);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () =>
  {
    setOpenEditDialog(false);
    setSelectedRouteToEdit(null);
  };

  /** Deals with user requesting closing the snackbar */
  const handleSnackbarClose = () =>
  {
    setSnackbar(prev => ({ ...prev, open: false }));
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
      //await loadOrders();
      loadRoutes();
    } else
    {
      console.error('Failed to delete item.');
    }

  }

  const deleteAllRoutesByDate = async (date) =>
  {
    //console.log("In delete all date is " + JSON.stringify(date) + " formatted is " + formatDate(date));
    let result = await deleteRouteByDate(date);
    //console.log("Delete all routes response is " + JSON.stringify(result));
    loadRoutes();
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
    const url = isActiveRoutes
      ? 'DeliveryRoutes/active'  // Active routes
      : 'DeliveryRoutes';        // All routes
    setRoutesLoading(true);
    try
    {
      const routesList = await fetchMethod(url);
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

        // Convert to an array of entries and sort by date
        const sortedGroupedRoutes = Object.entries(groupedRoutes).sort(([dateA], [dateB]) =>
          new Date(dateA) - new Date(dateB)
        );

        // Convert back to an object if needed
        const sortedRoutes = Object.fromEntries(sortedGroupedRoutes);

        setRoutes(sortedRoutes);

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
    finally
    {
      setRoutesLoading(false);
    }
  };


  // Define columns for DataGrid
  const columns = [
    { field: 'orderID', headerName: 'ID', flex: 0.5 },
    // { field: 'deliveryDate', headerName: 'Delivery Date', flex: 2, renderCell: (params) => formatDate(params.value) },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 4 },
    { field: 'status', headerName: 'Status', flex: 2 },
    { field: 'customerName', headerName: 'Customer Name', flex: 2.5 },
    // { field: 'productNames', headerName: 'Product Names', width: 500, renderCell: (params) => params.value.join(', ') },

  ];



  return (
    <Grid container>


      <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
          <RouteIcon sx={{ fontSize: 'inherit', marginRight: 1 }} />
          Routes
        </Typography>
      </Grid>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} mt={4}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 1500, width: '100%' }}>

        <Grid item xs={12} md={12} container spacing={2}>
  <Grid item xs={2} md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Typography>{isActiveRoutes ? "Active Routes" : "All Routes"}</Typography>
    <Switch
      checked={isActiveRoutes}
      onChange={handleToggle}
      color="primary"
    />
  </Grid>
  
  <Grid item xs={10} padding={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Button
      variant="contained"
      color="primary"
      onClick={handleOpenModal}
      sx={{ borderRadius: '18px' }}
    >
      <AddIcon sx={{ fontSize: '2rem' }} /> Create New Routes
    </Button>
  </Grid>



            <Grid item xs={12} md={12} container spacing={2} alignItems="center" maxWidth='1200px'>
              {routesLoading ? (
                <Skeleton sx={{
                  width: '100%',  // Make it responsive to parent container
                  height: '100px', // Auto-adjust height for responsiveness
                }} />
              ) : (
                <>

                  {/* Render assigned vehicles */}
                  {Object.entries(routes).map(([date, dateRoutes]) => (
                    <Grid key={date} item xs={12} md={12} container spacing={2} alignItems="center" maxWidth='1200px'>
                      <Accordion key={date} sx={{ width: '100%' }} slotProps={{ transition: { unmountOnExit: true } }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel-${date}-content`}
                          id={`panel-${date}-header`}
                          sx={{
                            backgroundColor: theme.palette.primary.accent,  // Set background color
                            borderBottom: '1px solid grey', // Add a border
                            borderRadius: '8px',
                            margin: 0.5,
                            '&:hover': {
                              backgroundColor: theme.palette.secondary.main, // Hover effect
                            },
                            '& .MuiTypography-root': {
                              fontWeight: 'bold', // Custom font styles for text
                              color: theme.palette.text.primary, // Change text color
                            },
                          }}
                        >
                          <Grid container margin={0.1}>
                            <Grid item xs={12} md={4} marginBottom={0.5} marginTop={0.5}>
                              <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                                <CalendarTodayIcon color="primary" />
                                <Typography variant='h6' >
                                  {formatDate(date)}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={4} marginTop={2}>
                              <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                                <Typography variant="subtitle1">
                                  Total Routes: {dateRoutes.length}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={4} marginTop={2}>
                              <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                                <Typography variant="subtitle1">
                                  Total Orders: {dateRoutes.reduce((acc, curr) => acc + curr.orders.length, 0)}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                        </AccordionSummary>
                        <AccordionDetails
                          key={`panel-${date}-details`}
                        >
                          <Grid item xs={12} md={12} sx={{ ml: 'auto' }}>
                            <Button
                              onClick={() => deleteAllRoutesByDate(date)}
                              color="error"
                              variant="outlined"
                              size='small'
                            >
                              Delete All Routes For {formatDate(date)}
                            </Button>
                          </Grid>
                          {dateRoutes.map((route) => (
                            <Grid container item xs={12} md={12} sx={{ mb: 5 }}>
                              <Grid item xs={12} md={12} container alignItems="center" spacing={2} sx={{ mb: 2 }}>

                                {/* Route Details with Icons */}
                                <Grid item xs={6} md={5}>
                                  <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
                                    <LabelIcon color="primary" />
                                    <Typography>ID: {route.deliveryRouteID}</Typography>
                                  </Box>

                                  <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
                                    <DirectionsCarIcon color="primary" />
                                    <Typography>Vehicle: {route.vehicleId}</Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
                                    <PersonIcon color="primary" />
                                    <Typography>Driver: {route.driverUsername}</Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
                                    <FormatListNumberedIcon color="primary" />
                                    <Typography>Orders: {route.orders.length}</Typography>
                                  </Box>
                                </Grid>
                                {/**Spacer grid */}
                                <Grid item xs={4} md={4}></Grid>

                                {/**Grid for buttons */}
                                <Grid container item xs={2} md={3} sx={{ ml: 'auto' }}>
                                  <Grid item xs={6} md={6}>
                                    <Tooltip
                                      title={route.orders.some(order => order.status !== 'ASSIGNED' && order.status !== 'CANCELLED') ? "Cannot edit, some orders are not assigned or cancelled." : ""}
                                      disableHoverListener={!route.orders.some(order => order.status !== 'ASSIGNED' && order.status !== 'CANCELLED')}
                                    >
                                      <span>
                                        <Button
                                          onClick={() => handleEditClick(route)}
                                          color="primary"
                                          variant="outlined"
                                          size='small'
                                          disabled={route.orders.some(order => order.status !== 'ASSIGNED' &&
                                            order.status !== 'CANCELLED')}
                                        >
                                          Edit Route
                                        </Button>
                                      </span>
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={6} md={6} >
                                    <Tooltip
                                      title={route.orders.some(order => order.status !== 'ASSIGNED' && order.status !== 'CANCELLED') ? "Cannot delete, some orders are not assigned or cancelled." : ""}
                                      disableHoverListener={!route.orders.some(order => order.status !== 'ASSIGNED' && order.status !== 'CANCELLED')}
                                    >
                                      <span>
                                        <Button
                                          onClick={() => deleteRoute(route.deliveryRouteID)}
                                          color="error"
                                          variant="outlined"
                                          size='small'
                                          disabled={route.orders.some(order => order.status !== 'ASSIGNED' &&
                                            order.status !== 'CANCELLED')}

                                        >
                                          Delete Route
                                        </Button>
                                      </span>
                                    </Tooltip>
                                  </Grid>

                                </Grid>
                              </Grid>

                              {/* Grid container for table and map side by side */}
                              <Grid container item xs={12} spacing={2}>
                                {/* DataGrid for orders */}
                                <Grid item xs={12} md={7} sx={styleConstants.fieldSpacing}>
                                  <DataGrid
                                    rows={route.orders
                                      .slice()
                                      .sort((a, b) => a.position - b.position)
                                      .map((order) => ({ id: order.orderID, ...order }))}
                                    columns={columns}
                                    pageSize={5}
                                    autoHeight
                                    density='compact'
                                  />
                                </Grid>

                                {/* Map for orders */}
                                <Grid item xs={12} md={5} sx={styleConstants.fieldSpacing}>
                                  {route.orders && route.orders.length > 0 ? (

                                    <MapWithPins
                                      inputLocations={route.orders
                                        .slice()
                                        .sort((a, b) => a.position - b.position)
                                        .map((order) => ({
                                          latitude: order.latitude,
                                          longitude: order.longitude,
                                        }))}
                                    />
                                  ) : (
                                    <p>No Orders</p>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                        </AccordionDetails>

                      </Accordion>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>


            {/* Modal for AddRouteForm */}
            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="add-route-modal"
              aria-describedby="add-route-form"
            >
              <Box sx={modalStyle}>
                <Grid container alignItems="center">  {/* Use Grid container for alignment */}
                  <Grid item xs={10}>  {/* Title takes up 10 units */}
                    <Typography
                      id="add-route-modal"
                      variant="h6"
                      component="h2"
                      align="left"  // Align text to the left
                      sx={{ fontWeight: 'bold', mb: 1 }}  // Bold and margin below
                    >
                      Create New Routes
                    </Typography>
                  </Grid>
                  <Grid item xs={2} textAlign="right">  {/* Button takes up 2 units */}
                    <Button onClick={handleCloseModal}>
                      <CancelIcon />
                    </Button>
                  </Grid>
                </Grid>
                <AddRouteForm updateRoutes={loadRoutes} closeView={handleCloseModal} showMessage={handleShowMessage} />
              </Box>
            </Modal>

          </Grid>
        </Paper>
      </Box>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth>
        <EditRouteForm route={selectedRouteToEdit} onClose={handleCloseEditDialog} onRefresh={loadRoutes} showMessage={handleShowMessage} />
      </Dialog>
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
    </Grid>
  );
};

export default ViewRoutes;
