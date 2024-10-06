import React, { useEffect, useState, useRef} from 'react';
import {Snackbar, Alert,useMediaQuery, Box, Drawer, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DriverMap from '../components/DriverMap.jsx';
import { fetchDeliveryRoute, startDeliveryRoute, updateOrderStatusFromRoute } from '../store/apiFunctions';
import NoRouteFound from '../components/NoRouteFound.jsx';
import { disableScroll } from '../assets/scroll.js';
import ReportIssue from '../components/ReportIssue.jsx';
import { getRowColour } from '../store/helperFunctions.js';
import Cookies from 'js-cookie';
import DateSelectHighlight from '../components/DateSelectHighlight.jsx';
import dayjs from 'dayjs';
import Tooltip from '@mui/material/Tooltip';
import '../index.css';


const DriverViewRoutes = ({ inputUser }) => {
    // initialise drawer on the left (which shows delivery progress) to closed
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [phoneDialogOpen, setPhoneDialogOpen] = React.useState(false); // whether the phone number for current delivery is shown
    const [currentDelivery, setCurrentDelivery] = useState(null); // current order details
    const [nextDeliveries, setNextDeliveries] = useState([]); // next order details
    const [currentLocation, setCurrentLocation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noRoutesFound, setNoRoutesFound] = React.useState(false);
    const [routeId, setRouteId] = React.useState(null);
    const [anyPlanned, setAnyPlanned] = React.useState(true); // if any orders are planned, use to check whether the start delivery button should be shown
    const [finishedDelivery, setFinishedDelivery] = React.useState(false); // if delivery is finished
    const [issueDialogOpen, setIssueDialogOpen] = useState(false); //if the report issue dialog is open
    const otherUser = useRef(null);
    const driverUsername = Cookies.get('userName'); // username of logged in user, Admins will see no routes
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [dateOptions, setDateOptions] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
      });

    const toggleDrawer = (open) => () => { setDrawerOpen(open); }
    const handlePhoneDialog = (open) => () => { setPhoneDialogOpen(open); };
    const handleIssueDialogOpen = () => { setIssueDialogOpen(true); };
    const handleIssueDialogClose = () => { setIssueDialogOpen(false); };

    const fetchDeliveryData = async () => {
        try {
            setCurrentDelivery(null);
            setNextDeliveries(null);
            var routeData;
            //uses logged in user unless a specific username given to component
            if(otherUser.current)
            {
                
                routeData = await fetchDeliveryRoute(otherUser.current);
                console.log("fetched for ", otherUser.current);
            }
            else{
                
                routeData = await fetchDeliveryRoute(driverUsername);
                console.log("fetched for ", driverUsername);
            }
            if (routeData) {
                
                const routeDates = extractDeliveryDates(routeData);
                setDateOptions(routeDates);
                
            
                setNoRoutesFound(false); // added to reload routes if found on driver change

                const selectedDateString = selectedDate.toISOString().split('T')[0];
            
                // Extract the route that matches the selected date
                const selectedRoute = routeData.find(route => 
                    route.deliveryDate.split('T')[0] === selectedDateString
                );
            
                if (selectedRoute) {
                    setRouteId(selectedRoute.deliveryRouteID);
                    
                    const pendingDeliveries = selectedRoute.orders.filter(order => 
                        order.status !== 'DELIVERED' && order.status !== 'ISSUE'
                    );
                    
                    const sortedDeliveries = pendingDeliveries.sort((a, b) => 
                        a.position - b.position
                    );
                    
                    setCurrentDelivery(sortedDeliveries[0]);
                    setNextDeliveries(sortedDeliveries.slice(1));
            
                    const anyPlanned = sortedDeliveries.some(order => order.status === 'ASSIGNED');
                    const finishedDelivery = sortedDeliveries.every(order => 
                        order.status === 'DELIVERED' || order.status === 'ISSUE' || order.status === 'CANCELLED'
                    );
                    
                    setAnyPlanned(anyPlanned);
                    setFinishedDelivery(finishedDelivery);
                } else {
                    console.error("No route found for the selected date:", selectedDate);
                    setNoRoutesFound(true);
                }
            } else {
                console.error("No route data returned.");
                setDateOptions([]);
                setNoRoutesFound(true);
            }
        } catch (error) {
            console.error("Error fetching delivery route:", error);
            setDateOptions([]);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleShowMessage = (msg, type) =>
        {
          setSnackbar({
            open: true,
            message: msg,
            severity: type
          });
        };

        const handleSnackbarClose = () =>
            {
              setSnackbar(prev => ({ ...prev, open: false }));
            };

    function extractDeliveryDates(routes) {
        // Extract delivery dates
        const deliveryDates = new Set();

        // Loop through each vehicle's routes
        routes.forEach(route => {
            // Add the deliveryDate of the route to the Set
            deliveryDates.add(route.deliveryDate.split('T')[0]); // Only take the date part
        });

        // Convert Set to Array and sort it
        const uniqueDeliveryDates = Array.from(deliveryDates).sort();

        console.log(uniqueDeliveryDates);
        return uniqueDeliveryDates;
    }

    const handleStartDelivery = async () => {
        if (routeId) {
            await startDeliveryRoute(routeId);
            await fetchDeliveryData();
        }
        else {
            console.error("No route ID found.")
        }
    };

    const isMobile = useMediaQuery('(max-width:600px)'); 

    const handleMarkAsDelivered = async () => {
        if (currentDelivery) {
            const input = {
                username: otherUser.current || driverUsername,
                orderID: currentDelivery.orderID,
                status: "DELIVERED"
            };
            const result = await updateOrderStatusFromRoute(input);
            await fetchDeliveryData();

            if (result) {
                const remainingDeliveries = nextDeliveries.slice(1);
                setCurrentDelivery(nextDeliveries[0] || null);
                setNextDeliveries(remainingDeliveries);
            }

            handleShowMessage("Order marked as delivered", "success");
        }
    };

    useEffect(() => { //disable scrolling on page load
        disableScroll();
    }, []);

    useEffect(() => { //disable scrolling on page load
        console.log("Dates: ", dateOptions);
    }, [dateOptions]);

    useEffect(() => {
        if( inputUser ) {
            otherUser.current=inputUser;
            console.log("input user: ", inputUser);
            console.log("other user: ", otherUser.current);
        }
        if (driverUsername) {
            fetchDeliveryData();
        }
    }, [driverUsername, inputUser, selectedDate]);

    useEffect(() => { // use effect for fetching the current location
        if (!noRoutesFound) // Only fetch location if routes found
        {
            setIsLoading(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        setCurrentLocation([longitude, latitude]); // update state with valid location
                        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error("Error fetching location:", error);
                        setIsLoading(false);
                    });
            } else {
                console.log("Geolocation is not supported by this browser.");
                setIsLoading(false);
            }
        }
    }, [noRoutesFound]);
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: '95vw', // drawer takes up 95% of the screen
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isMobile ? '95vw' : '30vw',
                        boxSizing: 'border-box',
                        backgroundColor: '#FFFFF',
                        zIndex: 1200,
                        overflowY: 'auto',
                        paddingTop: '56px',
                        
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        p: 0,
                        backgroundColor: '#819bc5',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        borderRadius: '0 0 16px 16px',
                    }}
                >
                    <Typography variant="h6" color="var(--text-colour)" sx={{ p: 2, fontWeight: 'bold' }}>
                        Delivery Progress
                    </Typography>
                    <Box sx={{ mb: 2 }}> 
                    <DateSelectHighlight
                            highlightedDates={dateOptions}
                            selectedDate={selectedDate}
                            handleDateChange={handleDateChange}
                            />
                            </Box>
                </Box>
                {!finishedDelivery && !noRoutesFound && (
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                top: 0,
                                left: 0,
                                width: 'calc(100% - 32px)%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 2,
                                borderRadius: 4,
                            }}
                        >
                            {anyPlanned && (
                                <Button variant="contained" color="primary" onClick={handleStartDelivery}
                                    sx={{
                                        flex: 1,
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                                    }}>
                                    Start Delivery
                                    <LocalShippingIcon sx={{ marginLeft: 2 }} />
                                </Button>
                            )}
                            {!anyPlanned && (
                                <Box sx={{
                                    display: 'flex',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '32px',
                                    p: 0,
                                    backgroundColor: '#fffff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                    marginTop: 1,
                                    borderRadius: 2,
                                }}
                                >
                                    <Typography variant="body2" color="textSecondary" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.875rem',
                                    }}>
                                        Delivery Started
                                        <LocalShippingIcon sx={{ marginLeft: 1, verticalAlign: 'middle' }} />
                                    </Typography>
                                </Box>
                            )}

                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                top: 0,
                                left: 0,
                                width: 'calc(100% - 32px)%',
                                p: 0,
                                backgroundColor: 'var(--background-colour)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                margin: 2,
                                marginTop: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="h6" color="var(--text-colour)" sx={{ p: 2, fontSize: '0.875rem', fontWeight: 'bold' }}>
                                Current Delivery
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                top: 0,
                                left: 0,
                                width: 'calc(100% - 32px)',
                                p: 0,
                                backgroundColor: '#D7E1F0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                marginLeft: 2,
                                marginBottom: 2,
                                borderRadius: 4,
                            }}
                        > {noRoutesFound ? (
                            <Typography variant="body1" color="textSecondary" sx={{mt:1, ml: 2}}>
                                No deliveries
                            </Typography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table sx={{ backgroundColor: getRowColour(currentDelivery?.delayed) }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ width: 120 }}>Address</TableCell>
                                            <TableCell>{currentDelivery?.address}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ width: 120 }}>Customer Name</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '0.875rem' }}>{currentDelivery?.customerName}</Typography>
                                                    <IconButton onClick={handlePhoneDialog(true)} sx={{ ml: 2 }}>
                                                        <PhoneIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ width: 120 }}>Order ID</TableCell>
                                            <TableCell>{currentDelivery?.orderID}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ width: 120 }}>Products</TableCell>
                                            <TableCell>{currentDelivery?.productNames.join(', ')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ width: 120 }}>Status</TableCell>
                                            <TableCell>{currentDelivery?.status}{currentDelivery?.delayed ? ", DELAYED" : ""}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>)}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: 'calc(100% - 32px)',
                                p: 2,
                            }}
                        >
                            {!anyPlanned && (
                                <>
                                    <Button variant="contained" color="primary" onClick={handleMarkAsDelivered}
                                        sx={{
                                            flex: 1,
                                            marginRight: 2,
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                                        }}>
                                        Mark as Delivered
                                        <CheckCircleIcon />
                                    </Button>
                                    <Button variant="outlined" color="primary" onClick={handleIssueDialogOpen}
                                        sx={{
                                            flex: 1,
                                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                                        }}>
                                        Report Issue
                                        <WarningAmberIcon />
                                    </Button>
                                    <ReportIssue open={issueDialogOpen} onClose={handleIssueDialogClose} driverUsername={otherUser.current || driverUsername} order={currentDelivery} fetchDeliveryData={fetchDeliveryData} showMessage={handleShowMessage} />
                                </>
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                top: 0,
                                left: 0,
                                width: 'calc(100% - 32px)',
                                p: 0,
                                backgroundColor: 'var(--background-colour)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                margin: 2,
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="h6" color="var(--text-colour)" sx={{ p: 2, fontSize: '0.875rem', fontWeight: 'bold' }}>
                                Next Deliveries
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                top: 0,
                                left: 0,
                                width: 'calc(100% - 32px)',
                                p: 0,
                                backgroundColor: '#D7E1F0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                marginLeft: 2,
                                marginBottom: 2,
                                borderRadius: 4,
                            }}
                        >
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Address</TableCell>
                                            <TableCell>Customer Name</TableCell>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {nextDeliveries?.map((row, index) => (
                                            <TableRow key={index} sx={{ backgroundColor: getRowColour(row.delayed) }}>
                                                <TableCell>{row.address}</TableCell>
                                                <TableCell>{row.customerName}</TableCell>
                                                <TableCell>{row.orderID}</TableCell>
                                                <TableCell>{row.status}{row.delayed ? ", DELAYED" : ""}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                )}
                {finishedDelivery && (
                    <Box sx={{
                        display: 'flex',
                        top: 0,
                        left: 0,
                        width: '100% -32px',
                        height: '32px',
                        p: 0,
                        backgroundColor: '#fffff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        margin: 2,
                        borderRadius: 2,
                    }}
                    >
                        <Typography variant="body2" color="textSecondary" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                        }}>
                            Delivery Finished!
                            <LocalShippingIcon sx={{ marginLeft: 1, verticalAlign: 'middle' }} />
                        </Typography>
                    </Box>
                )}
                {noRoutesFound && (
                            <Typography variant="body1" color="textSecondary" sx={{mt:1, ml: 2}}>
                                No deliveries
                            </Typography>
                    )}   
                <Tooltip title={"Hide Delivery Progress"}>  
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'fixed',
                        top: 80,
                        right: isMobile ? '7vw' : '71vw',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
                </Tooltip>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, position: 'fixed', height: '100vh', width: '100vw', margin: 0, padding: 0 }}
            >
                
                {!drawerOpen && (
                    <Tooltip title={"Show Delivery Progress"}>
                    <IconButton
                        onClick={toggleDrawer(true)}
                        sx={{ position: 'fixed', top: 80, left: 16, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1300,color: 'black',boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)' }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    </Tooltip>
                )}
                <Box
                    sx={{
                        width: '100vw',
                        height: '100vh',
                        overflow: 'hidden',
                        position: 'fixed',
                        margin: 0, padding: 0
                    }}
                >
                    {isLoading ? (
                        <Box
                            sx={{
                                position: 'fixed',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                width: '100vw',
                                left: '0%',
                                top: '50%'
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : noRoutesFound || finishedDelivery ? (
                        <Box
                            sx={{
                                position: 'fixed',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                width: '100vw',
                                left: '-2%',
                                top: '-5%'
                            }}
                        >
                            <NoRouteFound />
                        </Box>
                    ) : (
                        currentLocation.length > 0 && (
                            (<DriverMap start={currentLocation} end={[currentDelivery?.longitude, currentDelivery?.latitude]} />)
                        )
                    )}
                </Box>
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
            <Dialog
                open={phoneDialogOpen}
                onClose={handlePhoneDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Call {currentDelivery?.customerName}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Phone number: {' '}
                        <a
                            href={`tel:${currentDelivery?.customerPhone}`}
                            style={{ textDecoration: 'none', color: 'blue' }}
                        >{currentDelivery?.customerPhone}</a>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
export default DriverViewRoutes;