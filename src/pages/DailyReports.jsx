import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import {enableScroll} from '../assets/scroll.js';
import MapWithPins from '../components/MapWithPins.jsx';


const DailyReports = () => {

    useEffect(() => {
        enableScroll();
    }, []);

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
            <h1>Daily Reports</h1>
            <MapWithPins inputLocations={[{latitude: 90, longitude: 110}]}/>
        </div>
    );
};

export default DailyReports;
