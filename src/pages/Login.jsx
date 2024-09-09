import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import {enableScroll} from '../assets/scroll.js';

//This branch is now protected

const Login = () => {
    useEffect(() => {
        enableScroll();
    }, []);

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
