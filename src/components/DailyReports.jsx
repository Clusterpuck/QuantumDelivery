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
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Link to="/viewroutes" className="nav-link">View Routes</Link>
                <Link to="/livetracking" className="nav-link">Live Tracking</Link>
                <Link to="/dailyreports" className="nav-link">Daily Reports</Link>
                <Link to="/addorder" className="nav-link">Add Order</Link>
            </div>
            <h1>Daily Reports</h1>
            <a href="/">Back Home</a>
        </div>
    );
};

export default DailyReports;
