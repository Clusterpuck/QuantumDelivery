import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../assets/Map.css";

mapboxgl.accessToken =
  'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

  const locations = [
    { latitude: -31.950527, longitude: 115.860457 }, // Perth CBD
    { latitude: -31.961029, longitude: 115.844934 }, // Kings Park
    { latitude: -31.953514, longitude: 115.857048 }, // Elizabeth Quay
    { latitude: -31.948260, longitude: 115.857800 }, // Perth Cultural Centre
    { latitude: -32.015240, longitude: 115.855590 }, // South Perth
    { latitude: -31.958506, longitude: 115.889336 }, // Optus Stadium
    { latitude: -31.987700, longitude: 115.816830 }, // University of Western Australia
    { latitude: -31.943376, longitude: 115.839438 }, // Kings Park Botanic Garden
    { latitude: -32.035006, longitude: 115.767695 }, // Fremantle
    { latitude: -31.953768, longitude: 115.857267 }, // Perth Bell Tower
  ];
  
  

const MapWithPins = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [115.857267, -31.950527 ],
      zoom: 10,
    });

      // Create markers from the locations array
      locations.forEach((location) =>
      {
          new mapboxgl.Marker()
              .setLngLat([location.longitude, location.latitude])
              .addTo(map);
      });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default MapWithPins;