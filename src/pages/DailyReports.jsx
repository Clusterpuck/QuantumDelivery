import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import {enableScroll} from '../assets/scroll.js';


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
        </div>
    );
};

export default DailyReports;
