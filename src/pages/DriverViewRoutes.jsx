import React,{useEffect, useState} from 'react';
import { Box, Drawer, IconButton, Typography, Button, Modal, Fade, CircularProgress } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import DriverMap from '../components/DriverMap.jsx'; 
import { fetchDeliveryRoute, fetchMethod, startDeliveryRoute, updateOrderStatus } from '../store/apiFunctions';
import NoRouteFound from '../components/NoRouteFound.jsx';
import {disableScroll} from '../assets/scroll.js';

const DriverViewRoutes = ({}) => 
{
    // initialise drawer on the left (which shows delivery progress) to closed
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false); // whether the phone number for current delivery is shown
    const toggleDrawer = (open) => (event)=>
    { setDrawerOpen(open); }
    const handlePhoneClick = () => 
    { setModalOpen(true); };
    const handleClose = () => 
    { setModalOpen(false); };
    const [currentDelivery, setCurrentDelivery] = useState(null);
    const [nextDeliveries, setNextDeliveries] = useState([]);
    const [currentLocation, setCurrentLocation] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [noRoutesFound, setNoRoutesFound] = React.useState(false); 
    const [routeId, setRouteId] = React.useState(null);
    const [anyPlanned, setAnyPlanned] = React.useState(true);
    const [finishedDelivery, setFinishedDelivery] = React.useState(false);

    const driverUsername = 'driver1@email.com'; // hard coded for now

    const getRowColor = (status) => {
        switch (status) {
            case 'delayed':
                return '#f8d7da'; // Light red
            default:
                return '#d4edda'; // Light green
        }
    };

    useEffect(() => {
        disableScroll();
    }, []);


    useEffect(() => { // use effect for fetching the current location
        if (!noRoutesFound)
        {
            setIsLoading(true);
            // Only fetch location if routes found
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const latitude = position.coords.latitude;
                  const longitude = position.coords.longitude;   
          
                  setCurrentLocation([longitude, latitude]); // Update state with valid location
                  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                  setIsLoading(false);
                },
                (error) => {
                  console.error("Error fetching location:", error);
                  setIsLoading(false);
                }
              );
            } else {
              console.log("Geolocation is not supported by this browser.");
              setIsLoading(false);
            }
        }
    }, [noRoutesFound]);

    const fetchDeliveryData = async () => {
        try {
            const routeData = await fetchDeliveryRoute(driverUsername);

            if (routeData?.status === 404) {
                setNoRoutesFound(true);
                return;
            }
            if (routeData) {
                console.log("Delivery route fetched", JSON.stringify(routeData));
                const pendingDeliveries = routeData.orders.filter(order => order.status !== 'delivered');
                const sortedDeliveries = pendingDeliveries.sort((a, b) => a.position - b.position);
                setCurrentDelivery(sortedDeliveries[0]);
                setNextDeliveries(sortedDeliveries.slice(1));

                const anyPlanned = sortedDeliveries.some(order => order.status === 'planned');
                const finishedDelivery = sortedDeliveries.every(order => order.status === 'delivered');
                setAnyPlanned(anyPlanned);
                setFinishedDelivery(finishedDelivery)
                console.log("Current delivery in use effect is ", sortedDeliveries[0]);
            } else {
                console.error("No route data returned");
                setNoRoutesFound(true);
            }
        } catch (error) {
            console.error("Error fetching delivery route:", error);
            setSnackbar({
                open: true,
                message: 'Failed to load delivery routes',
                severity: 'error'
            });
            setNoRoutesFound(true);
        }
    };

    useEffect(() => { // use effect for fetching delivery route
        
        const loadRouteId = async () => {
            const allRoutesData = await fetchMethod("deliveryroutes");
            if (allRoutesData) {
                const route = allRoutesData.find(route => route.driverUsername === driverUsername);
                const routeId = route ? route.id : null;
                setRouteId(routeId);
            }
        };

        if (driverUsername) {
            fetchDeliveryData();
            loadRouteId();
        }
    }, [driverUsername]);

    const handleStartDelivery = async () => {
        if (routeId) {
            await startDeliveryRoute(routeId);
            await fetchDeliveryData();
        }
        else {
            console.error("No route ID found.")
        }
    };

    const handleMarkAsDelivered = async () => {
        if (currentDelivery) {
            const input = {
                username: driverUsername,
                orderId: currentDelivery.orderId,
                status: "delivered"
            };
            const result = await updateOrderStatus(input);
            await fetchDeliveryData();

            if (result)
            {
                const remainingDeliveries = nextDeliveries.slice(1);
                setCurrentDelivery(nextDeliveries[0] || null);
                setNextDeliveries(remainingDeliveries);
            }
        }
    };
      
    return (
        <Box  sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: '95vw', // Width of the drawer
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '95vw', // Same width as above
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
                        width: '100%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#819bc5', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        borderRadius: '0 0 16px 16px', 
                    }}
                >
                    <Typography variant="h6" color="black" sx={{ p: 2, fontWeight: 'bold' }}>
                        Delivery Progress
                    </Typography>
                </Box>
                {!finishedDelivery && (
                <Box>
                    <Box 
                    sx={{
                        display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)%', // Full width of the drawer
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        margin: 2,
                        borderRadius: 4, 
                        }}
                    >
                        {anyPlanned && (
                        <Button variant="outlined" color="primary" onClick={handleStartDelivery}
                        sx={{
                            flex: 1,
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                            Start Delivery
                            <LocalShippingIcon  sx={{ marginLeft: 2 }} />
                        </Button>
                        ) }
                        {!anyPlanned && (
                        <Box sx={{
                            display: 'flex',
                            top: 0, // Position at the top
                            left: 0, // Align to the left
                            width: '100%', // Full width of the drawer
                            height: '32px',
                            p: 0, // Padding around the text
                            backgroundColor: '#fffff', 
                            justifyContent: 'center', // Horizontally centers the content
                            alignItems: 'center',     // Vertically centers the content
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
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
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#582c4d', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        margin: 2,
                        marginTop: 1,
                        borderRadius: 4, 
                        }}
                    >
                        <Typography variant="h6" color="white" sx={{ p: 2, fontSize: '0.875rem', fontWeight: 'bold' }}>
                            Current Delivery 
                        </Typography>
                    </Box>
                    <Box
                    sx={{
                    display: 'flex',
                    top: 0, // Position at the top
                    left: 0, // Align to the left
                    width: 'calc(100% - 32px)', // Full width of the drawer
                    p: 0, // Padding around the text
                    backgroundColor: '#D7E1F0', 
                    justifyContent: 'center', // Horizontally centers the content
                    alignItems: 'center',     // Vertically centers the content
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                    marginLeft: 2,
                    marginBottom: 2,
                    borderRadius: 4, 
                    }}
                    > {noRoutesFound ? (
                        <Typography variant="body1" color="textSecondary">
                            No deliveries
                        </Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                            <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: 120 }}>Address</TableCell>
                                        <TableCell>{currentDelivery?.addr}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: 120 }}>Customer Name</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography sx={{ fontSize: '0.875rem' }}>{currentDelivery?.customerName}</Typography>
                                                <IconButton onClick={handlePhoneClick} sx={{ ml: 2 }}>
                                                    <PhoneIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: 120 }}>Order ID</TableCell>
                                        <TableCell>{currentDelivery?.orderId}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: 120 }}>Products</TableCell>
                                        <TableCell>{currentDelivery?.productNames.join(', ')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: 120 }}>Status</TableCell>
                                        <TableCell>{currentDelivery?.status}</TableCell>
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
                        <Button variant="contained" color = "primary" onClick={handleMarkAsDelivered} 
                        sx={{
                            flex: 1,
                            marginRight: 2, 
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                            Mark as Delivered
                            <CheckCircleIcon  />
                        </Button>
                        <Button variant="outlined" color="primary"
                        sx={{
                            flex: 1,
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                            Report Issue
                            <WarningAmberIcon  />
                        </Button>
                        </>
                        )}
                    </Box>
                    <Box
                        sx={{
                        display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#819bc5', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        margin: 2,
                        borderRadius: 4, 
                        }}
                    >
                        <Typography variant="h6" color="white" sx={{ p: 2, fontSize: '0.875rem', fontWeight: 'bold' }}>
                            Next Deliveries 
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                        display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#D7E1F0', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
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
                                    {nextDeliveries.map((row, index) => (
                                        <TableRow key={index} sx={{ backgroundColor: getRowColor(row.status) }}>
                                            <TableCell>{row.addr}</TableCell>
                                            <TableCell>{row.customerName}</TableCell>
                                            <TableCell>{row.orderId}</TableCell>
                                            <TableCell>{row.status}</TableCell>
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
                            top: 0, // Position at the top
                            left: 0, // Align to the left
                            width: '100% -32px', // Full width of the drawer
                            height: '32px',
                            p: 0, // Padding around the text
                            backgroundColor: '#fffff', 
                            justifyContent: 'center', // Horizontally centers the content
                            alignItems: 'center',     // Vertically centers the content
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
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
                    <IconButton
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 30,
                            backgroundColor: 'rgb(187, 205, 235)',
                            color: 'black'
                        }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, position: 'fixed', height: '100vh', width: '100vw',  margin: 0, padding: 0 }}
            >
                {!drawerOpen && (
                    <IconButton
                        onClick={toggleDrawer(true)}
                        sx={{ position: 'fixed', bottom: 16, left: 16, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1300, }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
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
                        <CircularProgress /> {/* loading icon */}
                    </Box>
                    ) : noRoutesFound || finishedDelivery ? (
                        <Box
                     sx={{
                        position: 'fixed',
                        justifyContent: 'center', // Center horizontally
                        alignItems: 'center', // Center vertically
                        height: '100vh', // Full viewport height
                        width: '100vw',
                        left: '-2%',
                        top: '-5%'
                    }}
                    >
                        <NoRouteFound />
                        </Box>
                    ) : (
                        currentLocation.length > 0 && (
                           ( <DriverMap start={currentLocation} end={[currentDelivery?.longitude, currentDelivery?.latitude]} /> )
                        )
                    )}
                </Box>
            </Box>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                
            >
                <Fade in={modalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 200,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,
                            textAlign: 'center',
                            borderRadius: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            href="tel:+123456789"
                            fullWidth
                            
                            sx={{ mt: 0 , p: '12px',}}
                        >
                            {currentDelivery?.phone}
                        </Button>
                    </Box>
                </Fade>
            </Modal>

        </Box>
        
    );
};

export default DriverViewRoutes;