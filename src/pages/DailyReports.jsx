import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import {enableScroll} from '../assets/scroll.js';
import AddRouteForm from '../components/AddRouteForm.jsx'


const DailyReports = () => {

    useEffect(() => {
        enableScroll();
    }, []);

    return (
        <AddRouteForm/>
        
    )
};

export default DailyReports;
