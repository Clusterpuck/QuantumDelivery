import React, {useEffect, useState} from 'react';
import {Drawer, Box, IconButton, Tabs, Tab, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, Checkbox, Collapse} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddressSearch from "../components/AddressSearch.jsx";
import MapWithPins from '../components/MapWithPins.jsx';
import {fetchMethod, fetchDeliveryRoute} from '../store/apiFunctions.js';

// Page design for live tracking page
// address search is placeholder for directions API
const LiveTracking = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState(0);
    const [routesData, setRoutesData] = React.useState(null);
    const [checkedRoutes, setCheckedRoutes] = useState({});
    const [openRow, setOpenRow] = useState({});
    const [ordersData, setOrdersData] = React.useState({});

    const toggleDrawer = (open) => (event)=>
        { setDrawerOpen(open); }
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const fetchRouteData = async () =>
    {
            const fetchedRoutes = await fetchMethod("deliveryroutes");
            if (fetchedRoutes) {
                console.log("Delivery routes fetched", JSON.stringify(fetchedRoutes));
                setRoutesData(fetchedRoutes);
            } else {
                console.error("No routes data returned");
            }
    };

    const fetchOrdersFromDriver = async (username) =>
    {
        const fetchedOrders = await fetchDeliveryRoute(username);
        if (fetchedOrders) {
            console.log("Orders for driver ", username, JSON.stringify(fetchedOrders));
            return fetchedOrders.orders.sort((a, b) => a.position - b.position);
        } else {
            console.error("No route data returned");
            setNoRoutesFound(true);
        }
    }

    const handleCheckboxChange = (routeId) => (event) => {
        setCheckedRoutes((prevCheckedRoutes) => ({
            ...prevCheckedRoutes,
            [routeId]: event.target.checked,
        }))
        console.log("checkboxes: ", checkedRoutes);
    };

    useEffect(() =>
    {
        fetchRouteData();
    }, []);

    useEffect(() => {
        if (routesData) {
            const initialCheckedRoutes = {};
            routesData.forEach(route => {
                initialCheckedRoutes[route.id] = true;  // Set all checkboxes to checked
            });
            setCheckedRoutes(initialCheckedRoutes);
        }
    }, [routesData]);

    const handleRowToggle = async (routeId) => {
        setOpenRow((prevState) => ({
            ...prevState,
            [routeId]: !prevState[routeId], // Toggle the open state for the specific route
        }));

        // Fetch orders if the row is expanding
        if (!openRow[routeId]) {
            const route = routesData.find(r => r.id === routeId);
            if (route) {
                const orders = await fetchOrdersFromDriver(route.driverUsername);
                setOrdersData((prevOrders) => ({
                    ...prevOrders,
                    [routeId]: orders
                }));
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
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '40vw', // Same width as above
                        boxSizing: 'border-box',
                        backgroundColor: '#FFFFF',
                        overflowY: 'auto',
                        paddingTop: '70px',
                    },
                }}
                ModalProps={{

                    BackdropProps: {
                        style: { backgroundColor: 'transparent' }, // Removes the dark overlay
                    },
                }}
            >
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                    centered
                >
                    <Tab label="Filter Routes" />
                    <Tab label="Route Details" />
                </Tabs>
                <Box sx={{ padding: 2 }}>
                    {activeTab === 0 && (
                         <Box>
                         <Typography variant="h6">Routes</Typography>
                         {routesData ? (
                             <Table>
                                 <TableHead>
                                     <TableRow>
                                         <TableCell></TableCell>
                                         <TableCell>Route ID</TableCell>
                                         <TableCell>Driver</TableCell>
                                         <TableCell>Vehicle ID</TableCell>
                                         <TableCell></TableCell>
                                     </TableRow>
                                 </TableHead>
                                 <TableBody>
                                     {routesData.map((route) => (
                                         <React.Fragment key={route.id}>
                                         <TableRow>
                                             <TableCell>
                                                 <Checkbox
                                                     checked={!!checkedRoutes[route.id]}
                                                     onChange={handleCheckboxChange(route.id)}
                                                 />
                                             </TableCell>
                                             <TableCell>{route.id}</TableCell>
                                             <TableCell>{route.driverUsername}</TableCell>
                                             <TableCell>{route.vehicleId}</TableCell>
                                             <TableCell>
                                                 <IconButton
                                                     size="small"
                                                     onClick={() => handleRowToggle(route.id)}
                                                 >
                                                     {openRow[route.id] ? (
                                                         <KeyboardArrowUpIcon />
                                                     ) : (
                                                         <KeyboardArrowDownIcon />
                                                     )}
                                                 </IconButton>
                                             </TableCell>
                                         </TableRow>
                                         <TableRow>
                                             <TableCell
                                                 style={{ paddingBottom: 0, paddingTop: 0 }}
                                                 colSpan={5}
                                             >
                                                 <Collapse
                                                     in={openRow[route.id]}
                                                     timeout="auto"
                                                     unmountOnExit
                                                 >
                                                     <Box margin={1}>
                                                     {ordersData[route.id] ? (
                                                                    <Table>
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell>Order ID</TableCell>
                                                                                <TableCell>Address</TableCell>
                                                                                <TableCell>Customer Name</TableCell>
                                                                                <TableCell>Products</TableCell>
                                                                                <TableCell>Status</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {ordersData[route.id].map((order) => (
                                                                                <TableRow key={order.orderId}>
                                                                                    <TableCell>{order.orderId}</TableCell>
                                                                                    <TableCell>{order.addr}</TableCell>
                                                                                    <TableCell>{order.customerName}</TableCell>
                                                                                    <TableCell>{order.prodNames.join(", ")}</TableCell>
                                                                                    <TableCell>{order.status}</TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                ) : (
                                                                    <Typography>No orders available</Typography>
                                                                )}
                                                     </Box>
                                                 </Collapse>
                                             </TableCell>
                                         </TableRow>
                                     </React.Fragment>
                                     ))}
                                 </TableBody>
                             </Table>
                         ) : (
                             <Typography>No routes available</Typography>
                         )}
                     </Box>
                    )}
                    {activeTab === 1 && (
                        <Typography variant="body1">
                            Route Details goes here
                        </Typography>
                    )}
                </Box>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'absolute', 
                        top: '95%',           
                        transform: 'translateY(-50%)', 
                        right: '10px',       
                        backgroundColor: 'rgb(187, 205, 235)',
                        color: 'black',
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
            </Box>
        </Box>
);
};

export default LiveTracking;
