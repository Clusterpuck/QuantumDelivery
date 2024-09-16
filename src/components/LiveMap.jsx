import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const LiveMap = ({ checkedRoutes, ordersData }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [markers, setMarkers] = useState([]);

    // fetches directions for a route
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

    // initialises map
    useEffect(() => {
        if (map.current) return; // prevents reinitialisation
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [115.8575, -31.9505], // perth coordinates (need to change so it centres on the routes)
            zoom: 11,
        });
    }, []);

    // update map when checked routes changes or orders change
    useEffect(() => {
        if (!map.current) return;

        // clear existing markers
        markers.forEach(marker => marker.remove());
        setMarkers([]);

        // clear previous routes
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

        for (const routeId in ordersData) {
            if (checkedRoutes[routeId]) {
                const orders = ordersData[routeId].sort((a, b) => a.position - b.position);
                const routeCoordinates = orders.map(order => [order.longitude, order.latitude]);

                // add markers for orders
                orders.forEach(order => {
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.textContent = order.position;
                    el.style.backgroundColor = order.status === 'DELIVERED' ? '#379e34' : order.delayed ? '#b31746' : '#e0983a';

                    if (order.longitude && order.latitude) {
                        const marker = new mapboxgl.Marker(el)
                            .setLngLat([order.longitude, order.latitude])
                            .addTo(map.current);
                        newMarkers.push(marker);
                    }
                });

                allRoutePromises.push(fetchDirections(routeCoordinates));
            }
        }
        setMarkers(newMarkers);

        Promise.all(allRoutePromises).then((allRoutes) => {
            allRoutes.forEach((route, index) => {
                if (route) {
                    const routeId = Object.keys(ordersData)[index];
                    const colors = ['#b31746', '#293fab', '#6f2aad', '#b82ab3'];
                    const routeColor = colors[index % colors.length];

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
                        paint: { 'line-color': routeColor, 'line-width': 6 },
                    });
                }
            });
        });
    }, [checkedRoutes, ordersData]);

    return (
        <div ref={mapContainer} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} />
    );
};

export default LiveMap;