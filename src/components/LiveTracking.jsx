import React from 'react';
import { Link } from 'react-router-dom';
import AddressSearch from "./AddressSearch.jsx";
import MapWithPins from './MapWithPins.jsx';

// Page design for live tracking page
// address search is placeholder for directions API
const LiveTracking = () => {
  return (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
        }}
    >
        <h1>Live Tracking</h1>
        {/* <AddressSearch />  */}
        <MapWithPins/>
    </div>
);
};

export default LiveTracking;
