// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children, role }) => {
    const authToken = Cookies.get('authToken');
    const userRole = Cookies.get('userRole'); // Retrieve the role from the cookie

    // If user is not logged in
    if (!authToken) {
        return <Navigate to="/login" replace />;
    }

    // If a role is specified and user does not have the required role
    if (role && userRole !== role) {
        return <Navigate to="/unauthorized" replace />; // Redirect to an unauthorized page
    }

    return children; // Render the protected route
};

export default PrivateRoute;
