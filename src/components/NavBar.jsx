// src/components/Navbar.jsx
// nav bar component to be loaded in main
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; 

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="logo">
                    <a href="/">QuantaPath</a> 
                </div>
                <ul className="nav-links">
                    <li><Link to="/viewroutes" className="nav-item">View Routes</Link></li>
                    <li><Link to="/livetracking" className="nav-item">Live Tracking</Link></li>
                    <li><Link to="/dailyreports" className="nav-item">Daily Reports</Link></li>
                    <li><Link to="/addorder" className="nav-item">Add Order</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;