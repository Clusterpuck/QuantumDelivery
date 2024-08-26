import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ element }) => {
    const authToken = Cookies.get('authToken');
    console.log('Element:', element); // Debugging line
    return authToken ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
