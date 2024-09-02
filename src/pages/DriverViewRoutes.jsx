import React,{useEffect, useState} from 'react';
import { Box, Drawer, IconButton, Typography, Button, Modal, Backdrop, Fade, CircularProgress } from '@mui/material';import RouteIcon from '@mui/icons-material/Route';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
  } from '@mui/material';
  import DriverMap from '../components/DriverMap.jsx'; 
  import { fetchDeliveryRoute } from '../store/apiFunctions';

const DriverViewRoutes = ({updateData}) => 
{
    // initialise drawer on the left (which shows delivery progress) to closed
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false); // whether the phone number for current delivery is shown
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
      });
    const toggleDrawer = (open) => (event)=>
    {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
        {return}
        setDrawerOpen(open); //opens the drawer
    }
    const handlePhoneClick = () => {
        setModalOpen(true);
    };
    const handleClose = () => {
        setModalOpen(false);
    };

    const [currentDelivery, setCurrentDelivery] = useState(null);
    const [nextDeliveries, setNextDeliveries] = useState([]);
    const [currentLocation, setCurrentLocation] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

        const driverUsername = 'Bob1'; // hard coded for now

        const getRowColor = (status) => {
            switch (status) {
                case 'Delayed':
                    return '#f8d7da'; // Light red
                default:
                    return '#d4edda'; // Light green
            }
        };

        useEffect(() => {
            setIsLoading(true); 
            // Fetch current location when component mounts
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
        }, []);

        useEffect(() => {
            const loadDeliveryRoute = async (driverUsername) => {
              try {
                const routeData = await fetchDeliveryRoute(driverUsername);
                if (routeData) {
                  console.log("Delivery route fetched", JSON.stringify(routeData));
                  const sortedDeliveries = routeData.orders.sort(
                    (a, b) => a.position - b.position
                  );
                  setCurrentDelivery(sortedDeliveries[0]);
                  setNextDeliveries(sortedDeliveries.slice(1));
                  console.log("Current delivery in use effect is ", sortedDeliveries[0]);
                } else {
                  console.error("No route data returned");
                }
              } catch (error) {
                console.error("Error fetching delivery route:", error);
                setSnackbar({
                  open: true,
                  message: 'Failed to load delivery routes',
                  severity: 'error'
                });
              }
            };
        
            if (driverUsername) {
              loadDeliveryRoute(driverUsername);
            }
          }, [driverUsername]);
      
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
                        // Added background color for visibility
                        backgroundColor: '#FFFFF',
                        // Added zIndex to ensure it's above other content
                        zIndex: 1200,
                        overflowY: 'auto',
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
                >
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
                                    <TableCell>{currentDelivery?.prodNames.join(', ')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ width: 120 }}>Status</TableCell>
                                    <TableCell>{currentDelivery?.status}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box
                sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 'calc(100% - 32px)',
                p: 2,
                }}
                >
                    <Button variant="contained" color = "primary"
                    sx={{
                        flex: 1,
                        marginRight: 2, // Optional: adds space between the buttons,
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
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: 'rgb(187, 205, 235)',
                        color: 'black'
                    }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, position: 'relative', height: '100%'}}
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
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                    >
                    {isLoading ? (
                    <Box
                        sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        }}
                    >
                        <CircularProgress /> {/* Show loading icon */}
                    </Box>
                    ) : (
                        currentLocation.length > 0 && (
                        <DriverMap start={currentLocation} end={[currentDelivery?.lon, currentDelivery?.lat]} />
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