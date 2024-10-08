import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/Marker.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const LiveMap = ({ checkedRoutes, ordersData, routeIdToColour }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [allCoordinates, setAllCoordinates] = useState([]);
    const [centered, setCentered] = useState(false); // to ensure that the map only centers on the page load, and not when you check/uncheck routes



    const fetchDirections = async (coordinates) => {
        const validCoordinates = coordinates.filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));
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
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [115.8575, -31.9505], // perth coordinates
            zoom: 5,
        });
    }, []);

    useEffect(() => {
        console.log(allCoordinates)
    }, [allCoordinates]);

    useEffect(() => {
        if ((allCoordinates.length > 0) && (!centered)) {
            if (allCoordinates.length === 1) {
                // case when there's only one coordinate
                const singleCoord = allCoordinates[0];
                const bounds = new mapboxgl.LngLatBounds(singleCoord, singleCoord);
    
                
                bounds.extend([singleCoord[0] + 0.2, singleCoord[1] + 0.2]); 
                bounds.extend([singleCoord[0] - 0.2, singleCoord[1] - 0.2]);
    
                map.current.fitBounds(bounds, { padding: 50, offset: [150, -15] });
            } else {
                const bounds = allCoordinates.reduce((bounds, coord) => {
                    const bufferedCoord = [coord[0] + 0.2, coord[1] + 0.2];
                    return bounds.extend(coord).extend(bufferedCoord);
                }, new mapboxgl.LngLatBounds(allCoordinates[0], allCoordinates[0]));
    
                map.current.fitBounds(bounds, { padding: 50, offset: [200, -50] });
            }
            setCentered(true);
        }
    }, [allCoordinates, centered]);

    useEffect(() => {
        if (!map.current) return;

        markers.forEach(marker => marker.remove());
        setMarkers([]);

        Object.keys(checkedRoutes).forEach((routeId) => {
            if (map.current.getLayer(`route-layer-${routeId}`)) {
                map.current.removeLayer(`route-layer-${routeId}`);
            }
            if (map.current.getSource(`route-source-${routeId}`)) {
                map.current.removeSource(`route-source-${routeId}`);
            }
        });

        const newMarkers = [];
        const allRoutePromises = [];
        const routeIds = [];
        const tempAllCoordinates = [];

        for (const routeId in ordersData) {
            if (checkedRoutes[routeId]) {
                routeIds.push(routeId);
                const depotCoordinates = [ordersData[routeId].depotLongitude, ordersData[routeId].depotLatitude];
                const orders = ordersData[routeId].sort((a, b) => a.position - b.position);
                const routeCoordinates = [depotCoordinates, ...orders.map(order => [order.longitude, order.latitude]), depotCoordinates];

                const depotMarker = new mapboxgl.Marker({ color: 'blue' })
                    .setLngLat(depotCoordinates)
                    .setPopup(new mapboxgl.Popup().setText("Depot")) 
                    .addTo(map.current);
                newMarkers.push(depotMarker);

                orders.forEach(order => {
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.textContent = order.position;
                    if (order.status === 'DELIVERED') {
                        el.classList.add('delivered');
                    } else if (order.status === 'ISSUE') {
                        el.classList.add('issue');
                    } else if (order.delayed) {
                        el.classList.add('delayed');
                    } else {
                        el.classList.add('default');
                    }
                    
                    // Set the border color to match the route color
                    const borderColor = routeIdToColour[routeId];
                    el.style.border = `4px solid ${borderColor}`;

                    if (order.longitude && order.latitude) {
                        const marker = new mapboxgl.Marker(el)
                            .setLngLat([order.longitude, order.latitude])
                            .addTo(map.current);
                        newMarkers.push(marker);

                        if (routeCoordinates.length === 1) {
                            tempAllCoordinates.push([order.longitude, order.latitude]);
                        }
                    }
                });

                allRoutePromises.push(fetchDirections(routeCoordinates));
            }
        }
        setMarkers(newMarkers);

        Promise.all(allRoutePromises).then((allRoutes) => {
            allRoutes.forEach((route, index) => {
                const routeId = routeIds[index];
                const routeColour = routeIdToColour[routeId];

                if (route) {
                    console.log(`Route ID: ${routeId}, Color: ${routeColour}`);

                    map.current.addSource(`route-source-${routeId}`, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: { type: 'LineString', coordinates: route },
                        },
                    });

                    map.current.addLayer({
                        id: `route-layer-${routeId}`,
                        type: 'line',
                        source: `route-source-${routeId}`,
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: { 'line-color': routeColour, 'line-width': 6 },
                    });
                    tempAllCoordinates.push(...route);
                }
            });
            if (tempAllCoordinates.length > 0) {
                setAllCoordinates(tempAllCoordinates);
            }
        });
        
    }, [checkedRoutes, ordersData]);

    return (
        <div ref={mapContainer} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} />
    );
};

export default LiveMap;