// DriverMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Box} from '@mui/material';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const DriverMap = () => 
{
    const mapContainer = useRef(null);
    const map = useRef(null);

    const start = [115.84778740497089, -32.051015859146226] ;
    const end = [115.89784472278699, -31.98420998389418];

    const [steps, setSteps] = useState([]); // State to hold all the steps
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const getRoute = async(map, start, end) =>
    {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
        )
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };

    if (map.getSource('route')) {
        map.getSource('route').setData(geojson); }
    else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
            });
        }
        setSteps(data.legs[0].steps);
    };

    const handleNextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: start, // Set the initial center coordinates (to Perth)
            zoom: 15 // Set the initial zoom level
        });

        map.current.on('load', () => {
            getRoute(map.current, start, end);

            map.current.addLayer({
                id: 'point',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: start
                                }
                            }
                        ]
                    }
                },
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#3887be'
                }
            });
        });
    }, [start, end]);

    return (
        <Box sx={{ position: 'relative', display: 'flex', height: '100vh', justifyContent: 'center',
            alignItems: 'center', flexDirection: 'column' }}>
            <Box
                className="map-container"
                ref={mapContainer}
                sx={{ width: '100%', height: '85%' }}
            />
            <Box
                id="instructions"
                sx={{
                    position: 'absolute',
                    top:0,
                    width: '100%',
                    height: '15%',
                    padding: '20px',
                    backgroundColor: '#fff',
                    overflowY: 'auto',
                    fontFamily: 'sans-serif',
                    zIndex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >
                {steps.length > 0 && (
                    <Box sx={{ textAlign: 'center' }}>
                        <p>{steps[currentStepIndex].maneuver.instruction}</p>
                        <Box
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                marginTop: '10px' 
                            }}
                        >
                            <button
                                onClick={handlePreviousStep}
                                disabled={currentStepIndex === 0}
                                style={{ marginRight: '10px' }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNextStep}
                                disabled={currentStepIndex === steps.length - 1}
                                style={{ marginLeft: '10px' }}
                            >
                                Next
                            </button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};


export default DriverMap;