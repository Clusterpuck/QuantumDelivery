import React from 'react';
import { Link } from 'react-router-dom';

const DailyReports = () => {
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
            <a href="/">Back Home</a>
        </div>
    );
};

export default DailyReports;
