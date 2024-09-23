import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import {enableScroll} from '../assets/scroll.js';
import LandingPage from './LandingPage.jsx'
import HomePagePill from '../components/HomePagePill.jsx';
import Icon from '@mui/icons-material/Warehouse'; 
import { Grid } from '@mui/material';


const DailyReports = () => {

    useEffect(() => {
        enableScroll();
    }, []);

    return (
        <LandingPage/>
    )
};

export default DailyReports;
