import React, {useEffect, useState, useRef} from 'react';
import {Drawer, Box, IconButton, Tabs, Tab, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, Checkbox, Collapse} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {fetchMethod, fetchDeliveryRoute} from '../store/apiFunctions.js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {disableScroll} from '../assets/scroll.js';

// Page design for live tracking page
// address search is placeholder for directions API


const LiveTracking = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [routesData, setRoutesData] = React.useState(null);
    const [checkedRoutes, setCheckedRoutes] = useState({});
    const [openRow, setOpenRow] = useState({});
    const [ordersData, setOrdersData] = React.useState({});
    const [checkedOrdersData, setCheckedOrdersData] = useState({});
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [noRoutesFound, setNoRoutesFound] = useState(false);

    mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg'; 

    const toggleDrawer = (open) => (event)=>
        { setDrawerOpen(open); }

    useEffect(() => {
        console.log("Updated checkedRoutes: ", checkedRoutes);
    }, [checkedRoutes]);

    useEffect(() => {
        console.log("Updated checkedOrdersDAta: ", checkedOrdersData);
    }, [checkedOrdersData]);

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
        }));
    };
    

    useEffect(() =>
    {
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

    const handleRowToggle = async (routeId) => {
        setOpenRow((prevState) => ({
            ...prevState,
            [routeId]: !prevState[routeId], // Toggle the open state for the specific route
        }));
        
        if (!openRow[routeId]) {
            console.log("zzzzzz routes data: ", routesData)
            const route = routesData.find((r) => r.deliveryRouteID === routeId);
            if (route) {
                const orders = await fetchOrdersFromDriver(route.driverUsername);
                if (!route.driverUsername) {
                    console.error("Driver username is undefined for route:", route);
                    return;
                }
                setOrdersData((prevOrders) => ({
                    ...prevOrders,
                    [routeId]: orders,
                }));
            } else {
                console.error(`Route with ID ${routeId} not found.`);
            }
        }
    };

    const getRowColor = (status) => {
        switch (status) {
            case 'delayed':
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
                        console.log("xxXXhello route for driver username is " + JSON.stringify(route));
                        const orders = await fetchOrdersFromDriver(route.driverUsername);
                        newCheckedOrdersData[routeId] = orders;
                        console.log("xxXXfetched order -> ", JSON.stringify(newCheckedOrdersData));
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

    const fetchDirections = async (coordinates) => {
        const validCoordinates = coordinates.filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]))
        
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(';')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        
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

        console.log("Map loaded successfully.");

            // Remove existing markers
        markers.forEach(marker => marker.remove());

        const newMarkers = [];
        for (const routeId in checkedOrdersData) {
            const unsortedorders = checkedOrdersData[routeId];
            const orders = unsortedorders.sort((a, b) => a.position - b.position);
            orders.forEach(order => {
            if (order.longitude && order.latitude) {  
                const marker = new mapboxgl.Marker()
                    .setLngLat([order.longitude, order.latitude])
                    .addTo(map.current);
                newMarkers.push(marker);
            }
            else
            {
                console.error("Invalid coordinates for order:", order);
            }
            });
        }

        // Update the state with the new markers
        setMarkers(newMarkers);
      
        // Clear existing layers if they exist
        if (map.current.getLayer('route-layer')) {
          map.current.removeLayer('route-layer');
          map.current.removeSource('route-source');
          
        }
      
        const allCoordinates = [];
        for (const routeId in checkedOrdersData) {
          const orders = checkedOrdersData[routeId];
          const routeCoordinates = orders.map(order => [order.longitude, order.latitude]);
          allCoordinates.push(...routeCoordinates);
        }
      
        if (allCoordinates.length > 0) {
      
          // Fetch directions using the fetchDirections function
          fetchDirections(allCoordinates).then((route) => {
            if (route) {
              // Add the route line on the map
              map.current.addSource('route-source', {
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
                id: 'route-layer',
                type: 'line',
                source: 'route-source',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#7d84b2',
                  'line-width': 6,
                },
              });
            }
          });
        }
      
        // Add error event listener for map
        map.current.on('error', (e) => {
          console.error('Map error:', e);
        });
      }, [checkedOrdersData]);

  return (
    <Box  sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
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
            <Box sx={{paddingBottom: '50px'}}>
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
                                                                    <TableRow key={order.orderId} sx={{ backgroundColor: getRowColor(order.status) }}>
                                                                        <TableCell>{order.orderId}</TableCell>
                                                                        <TableCell>{order.address}</TableCell>
                                                                        <TableCell>{order.customerName}</TableCell>
                                                                        <TableCell>{order.productNames.join(", ")}</TableCell>
                                                                        <TableCell>{order.status}</TableCell>
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
            <Box component="main" sx={{ flexGrow: 1, position: 'fixed', height: '100vh', width: '100vw',  margin: 0, padding: 0 , pointerEvents: 'auto', }}>
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
