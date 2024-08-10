// src/components/Navbar.jsx
// nav bar component to be loaded in main
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; 

const Navbar = () => {
    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: "10px",
                backgroundColor: "#f8f9fa",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px", 
            }}
        >
            <Link to="/viewroutes" className="nav-link">View Routes</Link>
            <Link to="/livetracking" className="nav-link">Live Tracking</Link>
            <Link to="/dailyreports" className="nav-link">Daily Reports</Link>
            <Link to="/addorder" className="nav-link">Add Order</Link>
        </nav>
    );
};

export default Navbar;
