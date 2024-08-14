import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

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
            <LoginForm/>
        </div>
    );
};

export default Login;
