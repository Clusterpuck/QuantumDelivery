import React, { useEffect, useState, useRef } from 'react';
import {
    Drawer, Box, IconButton, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, Checkbox, Collapse
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchMethod } from '../store/apiFunctions.js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { disableScroll } from '../assets/scroll.js';
import LiveMap from '../components/LiveMap'; // Import the new LiveMap component
import '../assets/Marker.css'

// Page design for live tracking page

const LiveTracking = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true); // state for whether drawer is open
    const [routesData, setRoutesData] = React.useState(null); // routes data, returned by 'get delivery routes'

    // state to keep track of which routes are checked. Format: {<RouteID>: <boolean>, <RouteID>: <boolean>}
    // eg. {8: true, 9: true, 12: false, 18: true} means routes 8, 9 and 18 are checked, 12 is not.
    const [checkedRoutes, setCheckedRoutes] = useState({});

    // state to keep track of which rows are expanded to show order details. Format: {<RouteID>: <boolean>, <RouteID>: <boolean>}
    // eg. {8: true, 9: true, 12: false, 18: true} means that the rows for routes 8, 9 and 18 are expanded, 12 is not.
    const [openRow, setOpenRow] = useState({});

    // keeps track of orders data for each route. used for toggling the rows. Format: {<RouteID>: <OrdersArray>, <RouteID>: <OrdersArray>}
    const [ordersData, setOrdersData] = React.useState({});

    mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

    const toggleDrawer = (open) => () => { setDrawerOpen(open); }

    // fetched the route data using get delivery routes endpoint
    const fetchRouteData = async () => { 
        const fetchedRoutes = await fetchMethod("deliveryroutes");
        if (fetchedRoutes) {
            setRoutesData(fetchedRoutes);
            let tempOrdersData = {};
            fetchedRoutes.forEach(route => {
                tempOrdersData[route.deliveryRouteID] = route.orders;
            });
            setOrdersData(tempOrdersData); // puts the orders data into the ordersData state  
        } else {
            console.error("No routes data returned");
        }
    };

    const handleCheckboxChange = (routeId) => (event) => { // for when a checkbox is checked/unchecked
        setCheckedRoutes((prevCheckedRoutes) => ({
            ...prevCheckedRoutes,
            [routeId]: event.target.checked,
        }));
    };

    const handleRowToggle = (routeId) => { // for when a row is expanded
        setOpenRow((prevState) => ({
            ...prevState,
            [routeId]: !prevState[routeId],
        }));

        const orders = ordersData[routeId];
        if (orders) {
            const sortedOrders = orders.sort((a, b) => a.position - b.position);
        }
    };

    const getRowColor = (delayed) => { // for background colours, red for delayed, green for not.
        switch (delayed) {
            case true:
                return '#f8d7da'; // Light red
            default:
                return '#d4edda'; // Light green
        }
    };

    // USE EFFECTS

    useEffect(() => { // when the page mounts, disable scroll and fetch the route data
        disableScroll();
        fetchRouteData();
    }, []);

    useEffect(() => { // sets all checkboxes to true when the routes data loads
        if (routesData) {
            const initialCheckedRoutes = {};
            routesData.forEach(route => {
                initialCheckedRoutes[route.deliveryRouteID] = true;  // Set all checkboxes to checked
            });
            setCheckedRoutes(initialCheckedRoutes);
        }
    }, [routesData]);


    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: '40vw',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '40vw', 
                        boxSizing: 'border-box',
                        backgroundColor: '#FFFFF',
                        overflowY: 'auto',
                        paddingTop: '48px',
                        pointerEvents: 'auto',
                    },
                }}
                ModalProps={{
                    BackdropProps: {
                        style: { backgroundColor: 'transparent' }, // removes dark background when drawer is open
                    },
                    disableScrollLock: true,
                }}
            >
                <Box sx={{ paddingBottom: '50px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            marginTop: '20px',
                            backgroundColor: '#819bc5',
                            justifyContent: 'center', 
                            alignItems: 'center',     
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
                            borderRadius: '0 0 16px 16px',
                        }}
                    >
                        <Typography variant="h6" color="black" sx={{ p: 2, fontWeight: 'bold' }}>
                            Route Details
                        </Typography>
                    </Box>
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
                                    <React.Fragment key={route.deliveryRouteID}>
                                        <TableRow>
                                            <TableCell>
                                                <Checkbox
                                                    checked={!!checkedRoutes[route.deliveryRouteID]}
                                                    onChange={handleCheckboxChange(route.deliveryRouteID)}
                                                />
                                            </TableCell>
                                            <TableCell>{route.deliveryRouteID}</TableCell>
                                            <TableCell>{route.driverUsername}</TableCell>
                                            <TableCell>{route.vehicleId}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRowToggle(route.deliveryRouteID)}
                                                >
                                                    {openRow[route.deliveryRouteID] ? (
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
                                                    in={openRow[route.deliveryRouteID]}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Box margin={1}>
                                                        {ordersData[route.deliveryRouteID] ? (
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Order ID</TableCell>
                                                                        <TableCell>Address</TableCell>
                                                                        <TableCell>Customer</TableCell>
                                                                        <TableCell>Products</TableCell>
                                                                        <TableCell>Status</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {ordersData[route.deliveryRouteID].map((order) => (
                                                                        <TableRow key={order.orderID} sx={{ backgroundColor: getRowColor(order.delayed) }}>
                                                                            <TableCell>{order.orderID}</TableCell>
                                                                            <TableCell>{order.address}</TableCell>
                                                                            <TableCell>{order.customerName}</TableCell>
                                                                            <TableCell>{order.productNames.join(", ")}</TableCell>
                                                                            <TableCell>{order.status}{order.delayed ? ", DELAYED" : ""}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        ) : (
                                                            <Typography></Typography>
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
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: '61%',
                        backgroundColor: 'rgb(187, 205, 235)',
                        color: 'black'
                    }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, position: 'fixed', height: '100vh', width: '100vw', margin: 0, padding: 0, pointerEvents: 'auto', }}>
                <LiveMap checkedRoutes={checkedRoutes} ordersData={ordersData} />
                {!drawerOpen && (
                    <IconButton
                        onClick={toggleDrawer(true)}
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            left: 16,
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            zIndex: 1300,
                        }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default LiveTracking;
