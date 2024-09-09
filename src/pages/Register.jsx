import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from "../components/RegistrationForm"
import {enableScroll} from '../assets/scroll.js';

const Register = () => {
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
            <h1>Register</h1>
            <RegistrationForm/>
        </div>
    );
};

export default Register;
