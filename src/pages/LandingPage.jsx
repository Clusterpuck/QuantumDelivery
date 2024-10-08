import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomePagePill from '../components/HomePagePill.jsx';
import { Button, CardActions, CardHeader, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fetchMethod } from '../store/apiFunctions.js';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import AlarmIcon from '@mui/icons-material/Alarm';
import RouteIcon from '@mui/icons-material/Route';
import QLogo from '../../quantalogo.png';
import Cookies from 'js-cookie';
import Skeleton from '@mui/material/Skeleton';
import {enableScroll} from '../assets/scroll.js';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import OutboxIcon from '@mui/icons-material/Outbox';
import
    {
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
    } from '@mui/material';
import { Link } from 'react-router-dom';



const LandingPage = () =>
{
    const [homeData, setHomeData] = useState(null);
    const [loadingHomeData, setLoadingHomeData] = useState(true);
    const [username, setUsername] = useState('');
    const [rssItems, setRssItems] = useState(null);
    const [loadingRss, setLoadingRss] = useState(true);
    const theme = useTheme();
//    let Parser = require('rss-parser');

    useEffect(() =>
    {
        const storedName = Cookies.get('userName');
        if (storedName)
        {
            setUsername(emailToUsername(storedName));
        }

        fetchRssFeed();
        fetchHomeData();
        enableScroll();
    }, []);

    const fetchRssFeed = async () => {
        try {
            setLoadingRss(true);
          const response = await fetch('https://cors-anywhere.herokuapp.com/https://medium.com/feed/@will-carter');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const text = await response.text();
          
          // Parse the XML text to DOM
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
    
          // Extract the feed items
          const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
          }));
    
          setFeedItems(items);
        } catch (err) {
          console.error(err.message);
        } finally {
          setLoadingRss(false);
        }
      };

    const fetchHomeData = async () =>
    {
        setLoadingHomeData(true);
        const tempHomeData = await fetchMethod('Home');
        console.log("Home data is " + JSON.stringify(tempHomeData));
        setLoadingHomeData(false);
        if (tempHomeData)
        {
            setHomeData(tempHomeData);
        }
    };

    const emailToUsername = (email) =>
    {
        // Split the email at the "@" symbol and take the first part
        const username = email.split('@')[0];

        // Capitalize the first letter and return it
        return username.charAt(0).toUpperCase() + username.slice(1);
    };




    const FormatDate = () =>
    {
        // Extract the weekday
        const date = new Date();
        const optionsWeekday = { weekday: 'long' };
        const weekday = date.toLocaleDateString(undefined, optionsWeekday);

        // Format the full date
        const optionsFullDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const fullDate = date.toLocaleDateString(undefined, optionsFullDate);

        console.log("Day is " + weekday); // Logs the weekday

        return (
            <>
                <Typography variant="h5">
                    <strong>{weekday}</strong> {/* Bold day */}
                </Typography>
                <Typography variant="h6">
                    {fullDate}
                </Typography>
            </>
        )
    };

    const OrdersCard = () =>
    {
        console.log("In orders card");
        return (
          
            <Card elevation={10}
                sx={{ borderRadius: '20px', margin: '30px' }}
            >
                <CardHeader
                    title={<Typography variant="h4" >Today's Orders</Typography>}
                    sx={{ backgroundColor: theme.palette.primary.mediumaccent, padding: '16px' }} // Custom background color and padding
                />
                <CardContent>
                    <Grid container spacing={1.5}>
                        {/* Each HomePagePill takes full width */}
                        <Grid item xs={12}>
                            <HomePagePill text={"Total Orders"} amount={homeData?.ordersCount} Icon={WidgetsIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Active Orders"} amount={homeData?.activeOrdersCount} Icon={LocalShippingIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Delivered Orders"} amount={homeData?.deliveredCount} Icon={OutboxIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Issues"} amount={homeData?.ordersWithIssues?.length} Icon={FmdBadIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Delayed Orders"} amount={homeData?.delaysCount} Icon={AlarmIcon} />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
                    <Button 
                        variant='contained' 
                        size="large" 
                        component={Link} to="/orders"
                        sx={{
                            // Prevent color change on hover
                            '&:hover': {
                                color: 'white', // Keep text color the same on hover
                            },
                        }}
                         >
                            See Details
                        </Button>
                </CardActions>
            </Card>
        );
    };

    const RoutesCard = () =>
    {

        return (
            <Box sx={{ minWidth: 275 }}>
                <Card elevation={10}
                    sx={{ borderRadius: '20px', margin: '30px' }}>
                    <CardHeader 
                        title={<Typography variant="h4">Today's Routes</Typography>}
                        sx={{ backgroundColor: theme.palette.primary.mediumaccent, padding: '16px' }} // Custom background color and padding
                    />
                    <CardContent>
                        <Grid container spacing={1.5}>
                            {/* Each HomePagePill takes full width */}
                            <Grid item xs={12}>
                                <HomePagePill text={"Total Routes"} amount={homeData?.routesCount} Icon={RouteIcon} />
                            </Grid>
                            <Grid item xs={12}>
                                <HomePagePill text={"Active Routes"} amount={homeData?.activeRouteCount} Icon={DirectionsRunIcon} />
                            </Grid>
                            <Grid item xs={12}>
                                <HomePagePill text={"Planned Routes"} amount={homeData?.plannedRouteCount} Icon={InsertInvitationIcon} />
                            </Grid>
                            <Grid item xs={12}>
                                <HomePagePill text={"Finished Routes"} amount={homeData?.finishedRouteCount} Icon={CheckCircleOutlineIcon} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Drivers on Routes</Typography>
                                <TableContainer component={Paper} sx={{ borderRadius: '10px', boxShadow: 'none' }}>
                                <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <Table size="small">
                                            <TableBody>
                                                {homeData?.driversOnRoutes && homeData.driversOnRoutes.length > 0 ? (
                                                    homeData.driversOnRoutes.map((driver, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ borderBottom: '1px solid #ccc', textAlign: 'center' }}>{driver}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell sx={{ borderBottom: 'none', textAlign: 'center', padding: '16px' }}>
                                                            No Drivers
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                    </Table>
                                    </Box>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
                    <Button 
                        color='primary' 
                        variant='contained' 
                        size="large" 
                        component={Link} to="/viewroutes" 
                        sx={{
                            // Prevent color change on hover
                            '&:hover': {
                                color: 'white', // Keep text color the same on hover
                            },
                        }}
                    >See Details
                    </Button>
                </CardActions>
                </Card>
            </Box>
        );
    };

    return (
        <Grid container sx={{ minWidth: 275, mt: 2 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 1500, width: '100%' }}>
            <Grid container spacing={2} sx={{ minWidth: 275, mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Typography variant='h6'>
                        Welcome Back
                    </Typography>
                    <Typography variant='h4'>
                        <strong>{username}</strong>
                    </Typography>
                </Grid>
                {/**PLease center */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justifyContent="center" // Centers horizontally
                    alignItems="center" // Centers vertically
                >
                    <Box
                        sx={{
                            backgroundColor: theme.palette.primary.accent,
                            borderRadius: '20px',
                            padding: '10px',
                            display: 'flex', // Use flexbox for alignment
                            alignItems: 'center', // Center items vertically
                        }}
                    >
                        <img
                            src={QLogo}
                            alt="Quantum logo"
                            style={{
                                height: '100%', // Set height to fill the parent container
                                maxHeight: '60px', // Adjust this value based on your header height
                                marginRight: '15px', // Space between image and text
                                padding: '5px'
                            }}
                        />
                        <Typography variant="h2"
                            sx={{
                                fontFamily: 'monospace',
                                //fontFamily: '"Josefin Sans", sans-serif', // Use the font here
                            }}
                        >
                            QuantaPath
                        </Typography>
                    </Box>

                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography>
                        <FormatDate />
                    </Typography>
                </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
                {loadingHomeData ? <Skeleton variant="rectangular" height={400} /> : <OrdersCard />}
            </Grid>
            <Grid item xs={12} md={6}>
                {loadingHomeData ? <Skeleton variant="rectangular" height={400} /> : <RoutesCard />}
            </Grid>
            </Grid>
            </Paper>
        </Grid>

    );


}

export default LandingPage;