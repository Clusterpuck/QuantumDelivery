import React, { useEffect, useState, useRef } from 'react';
import {
    Drawer, Box, IconButton, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, Checkbox, Collapse, Skeleton
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchMethod } from '../store/apiFunctions.js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { disableScroll } from '../assets/scroll.js';
import LiveMap from '../components/LiveMap';
import { getStatusColour } from '../store/helperFunctions.js';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import NoRouteFound from '../components/NoRouteFound';

// Page design for live tracking page
const LiveTracking = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true); // state for whether drawer is open
    const [routesData, setRoutesData] = React.useState(null); // routes data, returned by 'get delivery routes'
    const [loadingRoutes, setLoadingRoutes] = useState(false);

    // state to keep track of which routes are checked. Format: {<RouteID>: <boolean>, <RouteID>: <boolean>}
    // eg. {8: true, 9: true, 12: false, 18: true} means routes 8, 9 and 18 are checked, 12 is not.
    const [checkedRoutes, setCheckedRoutes] = useState({});

    // state to keep track of which rows are expanded to show order details. Format: {<RouteID>: <boolean>, <RouteID>: <boolean>}
    // eg. {8: true, 9: true, 12: false, 18: true} means that the rows for routes 8, 9 and 18 are expanded, 12 is not.
    const [openRow, setOpenRow] = useState({});

    // keeps track of orders data for each route. used for toggling the rows. Format: {<RouteID>: <OrdersArray>, <RouteID>: <OrdersArray>}
    const [ordersData, setOrdersData] = React.useState({});
    const [routeIdToColour, setRouteIdToColour] = useState({});

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const colourPalette = [

        '#3a429f', // violet blue
        '#a97dce', // lavender
        '#f4a4af', // cherry blossom pink
        '#a7577f', // china rose
        '#3d096b' // persian indigo
    ];

    const handleDateChange = (date) => { // logic for showing orders from a specific date is still yet to be implemented.
        setSelectedDate(date);
    };

    /**
     * Selectes a colour, limited by the size of the array
     * For the routeID
     *
     * @param {*} routeId
     * @returns {*}
     */
    const generateColourFromId = (routeId) => {
        const index = parseInt(routeId, 10) % colourPalette.length;
        return colourPalette[index];
    };


    /**
     * Creates the array of assigned colours from the routeID
     *
     * @returns {{}}
     */
    function assignRouteColours(tempOrdersData) {
        const routeColourArray = {};
        for (const routeID in tempOrdersData) {
            routeColourArray[routeID] = generateColourFromId(routeID);
        }

        setRouteIdToColour(routeColourArray);
        console.log("xxXX routecoloursarray mae of ", JSON.stringify(routeColourArray));
        return routeColourArray;

    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

    const toggleDrawer = (open) => () => { setDrawerOpen(open); }

    // fetched the route data using get delivery routes endpoint
    const fetchRouteData = async () => {
        setLoadingRoutes(true);
        const fetchedRoutes = await fetchMethod("deliveryroutes");
        if (fetchedRoutes) {
            const filteredRoutes = fetchedRoutes.filter(route => {
                // filter out routes based on orders' status
                const hasPendingOrders = !route.orders.every(order => order.status === 'DELIVERED' || order.status === 'ISSUE');
    
                // filter out routes that don't match the selected date
                const routeDate = dayjs(route.deliveryDate).startOf('day'); // convert to dayjs object and normalize to start of the day
                const selectedDateNormalized = dayjs(selectedDate).startOf('day'); // normalize selected date
    
                return hasPendingOrders && routeDate.isSame(selectedDateNormalized);
            });

            setRoutesData(filteredRoutes);
            let tempOrdersData = {};
            filteredRoutes.forEach(route => {
                tempOrdersData[route.deliveryRouteID] = route.orders;
            });
            const routeColourArray = assignRouteColours(tempOrdersData);//create the colour map
            console.log("xxXXAssigned array made is ", JSON.stringify(routeColourArray));

            setOrdersData(tempOrdersData); // puts the orders data into the ordersData state  
        } else {
            console.error("No routes data returned");
        }
        setLoadingRoutes(false);
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
            //TODO this appears to be doin nothing
        }
    };


    const RoutesTableView = () => {
        if (loadingRoutes) {
            return (
                <>
                    <Skeleton />
                    <Skeleton
                        variant='wave'
                        sx={{
                            height: 500,  // Adjust the height based on the estimated table size
                            width: '100%', // Make the Skeleton take the full width of the container
                            borderRadius: 4 // Optional: Adds rounded corners to match table aesthetics
                        }}
                    />
                </>
            )
        }
        else if (routesData && routesData.length === 0) {
            return <NoRouteFound />;}
        else if (routesData) {
            return (
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
                                <TableRow
                                    sx={{
                                        //backgroundColor: routeIdToColour[route.deliveryRouteID],
                                        // Replace with your desired color
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0', // Hover effect
                                        },
                                        color: 'white',
                                    }}
                                >
                                    <TableCell>
                                        <Checkbox
                                            sx={{
                                                color: routeIdToColour[route.deliveryRouteID], // Unchecked color
                                                '&.Mui-checked': {
                                                    color: routeIdToColour[route.deliveryRouteID], // Checked color
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28, // Adjust the size of the checkbox icon
                                                },
                                            }}
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
                                                                <TableRow key={order.orderID} >
                                                                    <TableCell>{order.orderID}</TableCell>
                                                                    <TableCell>{order.address}</TableCell>
                                                                    <TableCell>{order.customerName}</TableCell>
                                                                    <TableCell>{order.productNames.join(", ")}</TableCell>
                                                                    <TableCell className={getStatusColour(order)} sx={{ color: '#f2f2f2', borderRadius: '10px' }}>{order.status}{order.delayed ? ", DELAYED" : ""}</TableCell>
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
            )
        }
        else {
            return (
                <Typography>No routes available</Typography>
            )
        }
    }

    // USE EFFECTS

    useEffect(() => { // when the page mounts, disable scroll and fetch the route data
        disableScroll();
        fetchRouteData();
    }, []);

    useEffect(() => { // refetch routes data when selected date changes.
        fetchRouteData();
    }, [selectedDate]);


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
                            height: '80px', // Adjust the height as needed
                        }}
                    >
                        <Typography variant="h6" color="black" sx={{ p: 2, fontWeight: 'bold' }}>
                            Route Details
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                            <DatePicker
                                value={selectedDate}
                                onChange={handleDateChange}
                                slotProps={{ textField: { size: 'small' } }}
                                
                            />
                        </LocalizationProvider>
                    </Box>
                    <RoutesTableView />

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
                <LiveMap checkedRoutes={checkedRoutes} ordersData={ordersData} routeIdToColour={routeIdToColour} />
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
