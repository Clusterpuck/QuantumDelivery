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
            <MapWithPins inputLocations={[{"latitude":-32.04114,"longitude":115.779658},{"latitude":-32.046631,"longitude":115.873669},{"latitude":-32.03806,"longitude":115.87216},{"latitude":-32.003071,"longitude":115.861699},{"latitude":-31.984252,"longitude":115.897796},{"latitude":-31.93585,"longitude":115.82259},{"latitude":-31.93585,"longitude":115.82259}]} />
        </div>
    );
};

export default DailyReports;
