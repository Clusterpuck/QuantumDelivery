import React, { useEffect, useState, useRef } from 'react';
import {
    Drawer, Box, IconButton, Tabs, Tab, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, Checkbox, Collapse
} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchMethod, fetchDeliveryRoute } from '../store/apiFunctions.js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { disableScroll } from '../assets/scroll.js';
import '../assets/Marker.css'

// Page design for live tracking page
// address search is placeholder for directions API


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
    // keeps track of orders data for each route. used for displaying routes. Format: {<RouteID>: <OrdersArray>, <RouteID>: <OrdersArray>}
    const [checkedOrdersData, setCheckedOrdersData] = useState({});
    // note. i think that ordersData and checkedOrdersData can be consolidated into one. will work on it -amira

    const mapContainer = useRef(null); // state for map container 
    const map = useRef(null); // state for map
    const [markers, setMarkers] = useState([]); // state for markers on the map
    const [noRoutesFound, setNoRoutesFound] = useState(false); // state for whether there are routes to display

    mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

    const toggleDrawer = (open) => (event) => { setDrawerOpen(open); }

    // debugging purposes
    useEffect(() => {
        console.log("Updated OpenRow: ", openRow);
    }, [openRow]);
    // debugging purposes
    useEffect(() => {
        console.log("Updated ordersdata: ", ordersData);
    }, [ordersData]);

    const fetchRouteData = async () => {
        const fetchedRoutes = await fetchMethod("deliveryroutes");
        if (fetchedRoutes) {
            console.log("xxXXDelivery routes fetched", JSON.stringify(fetchedRoutes));
            setRoutesData(fetchedRoutes);

            let tempOrdersData = {};

            // Step 2: Iterate through the deliveryRoutesData and populate ordersData
            fetchedRoutes.forEach(route => {
            tempOrdersData[route.deliveryRouteID] = route.orders;
            });
            setOrdersData(tempOrdersData);
            
            
        } else {
            console.error("No routes data returned");
        }
    };

    const fetchOrdersFromDriver = async (username) => {
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
        }));
    };


    useEffect(() => {
        disableScroll();
        fetchRouteData();
    }, []);

    useEffect(() => {
        if (routesData) {
            const initialCheckedRoutes = {};
            routesData.forEach(route => {
                initialCheckedRoutes[route.deliveryRouteID] = true;  // Set all checkboxes to checked
            });
            setCheckedRoutes(initialCheckedRoutes);
        }
    }, [routesData]);

    const handleRowToggle = (routeId) => {
        setOpenRow((prevState) => ({
            ...prevState,
            [routeId]: !prevState[routeId],
        }));
    
        const orders = ordersData[routeId];
        if (orders) {
            const sortedOrders = orders.sort((a, b) => a.position - b.position);
            // Update the state or handle UI changes if necessary
            console.log(`Orders for route ${routeId}:`, orders);
        } else {
            console.error(`No orders found for route ID ${routeId}.`);
        }
    };

    const getRowColor = (delayed) => {
        switch (delayed) {
            case true:
                return '#f8d7da'; // Light red
            default:
                return '#d4edda'; // Light green
        }
    };


    // Fetch orders for all checked routes whenever checkedRoutes changes
    useEffect(() => {
        const fetchOrdersForCheckedRoutes = async () => {
            const newCheckedOrdersData = {};

            for (const routeId of Object.keys(checkedRoutes)) {
                if (checkedRoutes[routeId]) {
                    console.log("checked routes -> ", JSON.stringify(checkedRoutes));
                    console.log("routes data -> ", JSON.stringify(routesData));
                    const route = routesData.find((r) => r.deliveryRouteID === Number(routeId));

                    console.log("routeId type:", typeof routeId, "value:", routeId);
                    console.log("route.deliveryRouteID type:", typeof route, "value:", route);

                    console.log("the route: ", JSON.stringify(routesData));
                    if (route) {
                        console.log("hello route for driver username is " + JSON.stringify(route));
                        const orders = await fetchOrdersFromDriver(route.driverUsername);
                        newCheckedOrdersData[routeId] = orders;
                        console.log("fetched order -> ", JSON.stringify(newCheckedOrdersData));
                    }
                }
            }
            setCheckedOrdersData(newCheckedOrdersData);
        };

        if (routesData) {
            fetchOrdersForCheckedRoutes();
        }
    }, [checkedRoutes, routesData]);

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11', // Style of the map
            center: [115.8575, -31.9505], // Initial coordinates, e.g., Perth
            zoom: 11,
        });
    }, [])

    // gets directions for the route, takes in route coordinates
    const fetchDirections = async (coordinates) => {
        const validCoordinates = coordinates.filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]))

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}?geometries=geojson&access_token=${mapboxgl.accessToken}&overview=full`;

        if (validCoordinates.length === 0) {
            console.error('No valid coordinates available for route.');
            return;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching directions: ${response.statusText}`);
            }

            const data = await response.json();
            return data.routes[0].geometry.coordinates;
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };

    useEffect(() => {
        if (!map.current) return;

        // Clear existing markers and routes
        markers.forEach(marker => marker.remove());
        setMarkers([]);

        // clears all previous route layers
        Object.keys(checkedRoutes).forEach((routeId) => {
            if (map.current.getLayer(`route-layer-${routeId}`)) {
                map.current.removeLayer(`route-layer-${routeId}`);
            }
            if (map.current.getSource(`route-source-${routeId}`)) {
                map.current.removeSource(`route-source-${routeId}`);
            }
        });

        // ddd markers and fetch routes for all checked routes
        const newMarkers = [];
        const allRoutePromises = [];


        for (const routeId in checkedOrdersData) {

            const unsortedOrders = checkedOrdersData[routeId];
            const orders = unsortedOrders.sort((a, b) => a.position - b.position);

            const routeCoordinates = orders.map(order => [order.longitude, order.latitude]);

            // Add markers for every order
            orders.forEach(order => {
                const el = document.createElement('div');
                el.className = 'marker'; 
                el.textContent = order.position; 
                if (order.status == 'DELIVERED') {
                    el.style.backgroundColor = '#379e34'; //green for delivered
                }
                else if (order.delayed) {
                    el.style.backgroundColor = '#b31746'; // red for delayed
                }
                else
                {
                    el.style.backgroundColor = '#e0983a'; // yellow for everything else
                }

                if (order.longitude && order.latitude) {
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([order.longitude, order.latitude])
                        .addTo(map.current);
                    newMarkers.push(marker);
                }
            });

            // fetch directions called for each route. returns promise which is stored in allRoutePromises array
            allRoutePromises.push(fetchDirections(routeCoordinates));
        }

        setMarkers(newMarkers);

        const colors = ['#b31746' /*red*/, '#293fab' /*blue*/, '#6f2aad' /*purple*/, '#b82ab3' /*pink*/];

        // wait for all routes to be fetched and then draw them on the map
        Promise.all(allRoutePromises).then((allRoutes) => {
            allRoutes.forEach((route, index) => {
                if (route) {
                    // adds source and layer for each route
                    const routeId = Object.keys(checkedOrdersData)[index]; // get the routeId for each set of directions
                    const routeColor = colors[index % colors.length]; // cycles through the 'colors' array
                    map.current.addSource(`route-source-${routeId}`, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: route,
                            },
                        },
                    });

                    map.current.addLayer({
                        id: `route-layer-${routeId}`,
                        type: 'line',
                        source: `route-source-${routeId}`,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': routeColor,
                            'line-width': 6,
                        },
                    });
                }
            });
        });

    }, [checkedOrdersData]);

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: '40vw', // Width of the drawer
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '40vw', // Same width as above
                        boxSizing: 'border-box',
                        backgroundColor: '#FFFFF',
                        overflowY: 'auto',
                        paddingTop: '48px',
                        pointerEvents: 'auto',
                    },
                }}
                ModalProps={{
                    BackdropProps: {
                        style: { backgroundColor: 'transparent' }, // Removes the dark overlay
                    },
                    disableScrollLock: true,
                }}
            >
                <Box sx={{ paddingBottom: '50px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%', // Full width of the drawer
                            marginTop: '20px',
                            backgroundColor: '#819bc5',
                            justifyContent: 'center', // Horizontally centers the content
                            alignItems: 'center',     // Vertically centers the content
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
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
                <div
                    ref={mapContainer}
                    style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, margin: 0, padding: 0, pointerEvents: 'auto', }}
                />
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
