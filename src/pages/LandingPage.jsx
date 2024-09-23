import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomePagePill from '../components/HomePagePill.jsx';
import { CardHeader, Grid, List, ListItem, ListItemText } from '@mui/material';
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
//import Parser from 'rss-parser';



const LandingPage = () =>
{
    const [homeData, setHomeData] = useState(null);
    const [loadingHomeData, setLoadingHomeData] = useState(true);
    const [username, setUsername] = useState('');
    const [rssItems, setRssItems] = useState(null);
    const theme = useTheme();
    //let Parser = require('rss-parser');
    //let parser = new Parser();

    useEffect( () => {
        const storedName = Cookies.get('userName');
        if(storedName)
        {
            setUsername( emailToUsername(storedName));
        }
        const fetchRssFeed = async () => {
            let feed = await parser.parseURL('https://www.reddit.com/.rss');
            console.log(feed.title);
          
            feed.items.forEach(item => {
              console.log(item.title + ':' + item.link)
            });
        };

        //fetchRssFeed();
        fetchHomeData();
    },[]);

    const fetchHomeData = async() =>{
        setLoadingHomeData(true);
        const tempHomeData = await fetchMethod('Home');
        console.log("Home data is " + JSON.stringify(tempHomeData));
        setLoadingHomeData(false);
        if(tempHomeData)
        {
            setHomeData(tempHomeData);
        }
    };

    const emailToUsername = (email) => {
        // Split the email at the "@" symbol and take the first part
        const username = email.split('@')[0];
        
        // Capitalize the first letter and return it
        return username.charAt(0).toUpperCase() + username.slice(1);
    };

    


    const FormatDate = () => {
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
            <Typography>
            <strong>{weekday}</strong> {/* Bold day */}
            </Typography>
            <Typography>
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
                    title={<Typography variant="h4" sx={{ color: '#fff' }}>TODAY'S ORDERS</Typography>}
                    sx={{ backgroundColor: theme.palette.primary.main, padding: '16px' }} // Custom background color and padding
                />
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Each HomePagePill takes full width */}
                        <Grid item xs={12}>
                            <HomePagePill text={"Total Orders"} amount={homeData?.ordersCount} Icon={WidgetsIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Active Orders"} amount={homeData?.activeOrdersCount} Icon={LocalShippingIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Issues"} amount={homeData?.ordersWithIssues?.length} Icon={FmdBadIcon} />
                        </Grid>
                        <Grid item xs={12}>
                            <HomePagePill text={"Delayed Orders"} amount={homeData?.delaysCount} Icon={AlarmIcon} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    const RoutesCard = () => {

        return (
        <Box sx={{ minWidth: 275 }}>
            <Card elevation={10}
                sx={{borderRadius:'20px', margin: '30px'}}>
                <CardHeader
                    title={<Typography variant="h4" sx={{ color: '#fff' }}>TODAY'S ROUTES</Typography>}
                    sx={{ backgroundColor: theme.palette.primary.main, padding: '16px' }} // Custom background color and padding
                />
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Each HomePagePill takes full width */}
                        <Grid item xs={12}>
                            <HomePagePill text={"Total Routes"} amount={homeData?.routesCount} Icon={RouteIcon} />
                        </Grid>
                        <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Drivers on Routes:</Typography>
                        <List>
                            {homeData?.driversOnRoutes.map((driver, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={driver} />
                                </ListItem>
                            ))}
                        </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

    return (
        <Grid container spacing={2} sx={{ minWidth: 275, mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Typography>
                        Welcome Back
                    </Typography>
                    <Typography>
                        <strong>{username}</strong>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
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
                                marginRight: '10px', // Space between image and text
                            }}
                        />
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
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
                { loadingHomeData ?  <Skeleton variant="rectangular" height={400}/> : <OrdersCard/>  }
             </Grid>
            <Grid item xs={12} md={6}>
                { loadingHomeData ? <Skeleton variant="rectangular" height={400}/> : <RoutesCard/>  } 
            </Grid>
        </Grid>

    );


}

export default LandingPage;