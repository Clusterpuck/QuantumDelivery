import React from 'react';
import { Box, Drawer, IconButton, Typography } from '@mui/material';import RouteIcon from '@mui/icons-material/Route';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
const DriverViewRoutes = ({updateData}) => 
{
    // initialise drawer on the left (which shows delivery progress) to closed
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const toggleDrawer = (open) => (event)=>
    {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
        {return}
        setDrawerOpen(open); //opens the drawer
    }

    return (
        <Box sx={{display: 'flex'}}>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    width: '90vw', // Width of the drawer
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '90vw', // Same width as above
                        boxSizing: 'border-box',
                        // Added background color for visibility
                        backgroundColor: '#FFFFF',
                        // Added zIndex to ensure it's above other content
                        zIndex: 1200,
                    },
                }}
            >
                <Box
            sx={{
                display: 'flex', // Absolute positioning within the drawer
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: '100%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#819bc5', 
                        display: 'flex',
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        borderRadius: '0 0 16px 16px', 
            }}
        >
            <Typography variant="h6" color="black" sx={{ p: 2, fontWeight: 'bold' }}>
                Delivery Progress
            </Typography>
        </Box>
       
        <Box
            sx={{
                display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: '90%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#BBCDEB', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        margin: 2,
                        borderRadius: 4, 
            }}
        >
            <Typography variant="h6" color="black" sx={{ p: 2, fontSize: '0.875rem' }}>
                Current Delivery 
            </Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: '90%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#BBCDEB', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        margin: 2,
                        borderRadius: 4, 
            }}
        >
            <Typography variant="h6" color="black" sx={{ p: 2, fontSize: '0.875rem' }}>
                Next Deliveries 
            </Typography>
        </Box>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        backgroundColor: 'rgb(187, 205, 235)',
                        color: 'black'
                    }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                {!drawerOpen && (
                    <IconButton
                        onClick={toggleDrawer(true)}
                        sx={{ position: 'fixed', bottom: 16, left: 16, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                )}
                
            </Box>

        </Box>
        
    );
};

export default DriverViewRoutes;