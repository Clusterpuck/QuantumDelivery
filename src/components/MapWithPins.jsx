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
            zoom: 13,
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


        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Clean up on unmount
        return () => map.remove();
    }, [inputLocations, depotLong, depotLat]);

    

    return <div className="map-container" ref={mapContainerRef} />;
};

export default MapWithPins;