import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../assets/Map.css";
import '../assets/Marker.css'

mapboxgl.accessToken =
    'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';


const MapWithPins = ({inputLocations, depotLong, depotLat}) =>
{

    const mapContainerRef = useRef(null);

    // Initialize map when component mounts
    useEffect(() =>
    {
        if (!inputLocations || inputLocations.length === 0) {
            console.error("xxXXinputLocations not provided or null.");
            return; 
        }
        const midOrder = Math.floor(inputLocations.length / 2)
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [ inputLocations[midOrder].longitude, inputLocations[midOrder].latitude],
            zoom: 10,
        });

        // Create markers from the locations array
        for( let i = 0; i < inputLocations.length; i++ )
        {
            const el = document.createElement('div');
            el.className = 'marker';
            el.textContent = i + 1; // Add the number to the marker
            
            new mapboxgl.Marker(el)
                .setLngLat([inputLocations[i].longitude, inputLocations[i].latitude])
                .addTo(map);
        };

        console.log("depot long,", depotLong, "depot lat ",depotLat);

        if (depotLong !== null && depotLat !== null) {
            const depotMarker = new mapboxgl.Marker({ color: 'purple' })
                    .setLngLat([depotLong, depotLat])
                    .addTo(map);
        }

        const coordinates = inputLocations.map(loc => [loc.longitude, loc.latitude]);

        // Add the depot coordinates if they're provided
        if (depotLong !== null && depotLat !== null) {
            coordinates.push([depotLong, depotLat]);
        }

        if (coordinates.length > 0) {
            const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

            map.fitBounds(bounds, {
                padding: 50, // Adjusts the padding around the map for a better view
                maxZoom: 15, // Ensures the zoom level doesn't get too close
            });
        }


        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Clean up on unmount
        return () => map.remove();
    }, [inputLocations, depotLong, depotLat]);

    

    return <div className="map-container" ref={mapContainerRef} />;
};

export default MapWithPins;