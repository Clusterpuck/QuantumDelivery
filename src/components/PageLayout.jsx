// src/components/PageLayout.jsx
import React from 'react';
import Navbar from './NavBar'; 

const PageLayout = ({ children }) => {
    return (
        <div>
            <Navbar /> 
            <main>
                {children} 
            </main>
        </div>
    );
};

export default PageLayout;
