import React from 'react';
import Navbar from './NavBar'; 
import '../assets/PageLayout.css';

const PageLayout = ({ children }) => {
    return (
        <div className="page-layout">
            <Navbar /> 
            <main className="main-content">
                {children} 
            </main>
        </div>
    );
};

export default PageLayout;
