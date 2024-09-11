import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../assets/Map.css";

mapboxgl.accessToken =
    'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';


const MapWithPins = ({inputLocations}) =>
{

    const mapContainerRef = useRef(null);

    // Initialize map when component mounts
    useEffect(() =>
    {
        //console.log("Input locations is ", JSON.stringify(inputLocations) );
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
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.backgroundColor = '#3FB1CE';
            el.style.color = 'white';
            el.style.display = 'flex';
            el.style.justifyContent = 'center';
            el.style.alignItems = 'center';
            el.style.borderRadius = '50%';
            el.style.fontSize = '16px';
            el.style.fontWeight = 'bold';
            el.style.cursor = 'pointer';
            new mapboxgl.Marker(el)
                .setLngLat([inputLocations[i].longitude, inputLocations[i].latitude])
                .addTo(map);
        };

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Clean up on unmount
        return () => map.remove();
    }, [inputLocations]);

    return <div className="map-container" ref={mapContainerRef} />;
};

export default MapWithPins;