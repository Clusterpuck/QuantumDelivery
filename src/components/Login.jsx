import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
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
            <h1>Login</h1>
            <a href="/">Back Home</a>
        </div>
    );
};

export default Login;
