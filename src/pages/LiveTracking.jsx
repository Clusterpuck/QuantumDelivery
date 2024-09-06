import React from 'react';
import {Drawer, Box, IconButton, Tabs, Tab, Typography} from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AddressSearch from "../components/AddressSearch.jsx";
import MapWithPins from '../components/MapWithPins.jsx';

// Page design for live tracking page
// address search is placeholder for directions API
const LiveTracking = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(0);

    const toggleDrawer = (open) => (event)=>
        { setDrawerOpen(open); }
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

  return (
    <Box  sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '30vw', // Same width as above
                        boxSizing: 'border-box',
                        backgroundColor: '#FFFFF',
                        overflowY: 'auto',
                        paddingTop: '70px',
                    },
                }}
                ModalProps={{
                    disableBackdropClick: true, // Disables clicking on the backdrop to close the drawer
                    BackdropProps: {
                        style: { backgroundColor: 'transparent' }, // Removes the dark overlay
                    },
                }}
            >
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                    centered
                >
                    <Tab label="Filter Routes" />
                    <Tab label="Route Details" />
                </Tabs>
                <Box sx={{ padding: 2 }}>
                    {activeTab === 0 && (
                        <Typography variant="body1">
                            Filter Routes goes here
                        </Typography>
                    )}
                    {activeTab === 1 && (
                        <Typography variant="body1">
                            Route Details goes here
                        </Typography>
                    )}
                </Box>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'absolute', 
                        top: '95%',           
                        transform: 'translateY(-50%)', 
                        right: '10px',       
                        backgroundColor: 'rgb(187, 205, 235)',
                        color: 'black',
                    }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, position: 'relative', height: '100%'}}
            >
                {!drawerOpen && (
                    <IconButton
                        onClick={toggleDrawer(true)}
                        sx={{ position: 'fixed', bottom: 16, left: 16, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1300, }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
);
};

export default LiveTracking;
