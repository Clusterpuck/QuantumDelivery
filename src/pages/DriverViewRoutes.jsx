import React from 'react';
import { Box, Drawer, IconButton, Typography, Button, Modal, Backdrop, Fade } from '@mui/material';import RouteIcon from '@mui/icons-material/Route';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
  } from '@mui/material';
const DriverViewRoutes = ({updateData}) => 
{
    // initialise drawer on the left (which shows delivery progress) to closed
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false); // whether the phone number for current delivery is shown

    const toggleDrawer = (open) => (event)=>
    {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
        {return}
        setDrawerOpen(open); //opens the drawer
    }
    const handlePhoneClick = () => {
        setModalOpen(true);
    };
    const handleClose = () => {
        setModalOpen(false);
    };

        // DUMMY DATA FOR NOW
        const currentDelRows = [
          '1140 Albany Highway',
          'Spudshed Bentley',
          'Order ID 872',
          'Product A, Product B, Product C',
        ];

        const nextDelRows = [
            { addr: '464 Fitzgerald St, North Perth', customer: 'Rosemount Bowling', orderId: '875'},
            { addr: '1/41 Burrendah Blvd, Willetton', customer: 'Silver Sushi', orderId: '903'},
            { addr: '311 William St, Northbridge', customer: 'Lucky Chans', orderId: '1001'},
            { addr: '17/789 Albany Highway, East Vic Park', customer: 'T4 Vic Park', orderId: '799'}
        ]
      

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
                        width: '100%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#819bc5', 
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
                        width: 'calc(100% - 32px)%', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#582c4d', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        margin: 2,
                        borderRadius: 4, 
            }}
        >
            <Typography variant="h6" color="white" sx={{ p: 2, fontSize: '0.875rem', fontWeight: 'bold' }}>
                Current Delivery 
            </Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#D7E1F0', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        marginLeft: 2,
                        marginBottom: 2,
                        borderRadius: 4, 
            }}
        >
            <TableContainer component={Paper}>
            <Table>
                <TableBody>
                {currentDelRows.map((row, index) => (
                    <TableRow key={index}>
                    <TableCell>{row}</TableCell>
                    {index === 1 && (
                        <TableCell align="right">
                             <IconButton onClick={handlePhoneClick}>
                                <PhoneIcon />
                            </IconButton>
                        </TableCell>
                    )}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Box>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 'calc(100% - 32px)',
                p: 2,
                }}
                >
                    <Button variant="contained" color = "primary"
                    sx={{
                        flex: 1,
                        marginRight: 2, // Optional: adds space between the buttons,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                        Mark as Delivered
                        <CheckCircleIcon  />
                    </Button>
                    <Button variant="outlined" color="primary"
                    sx={{
                        flex: 1,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                        Report Issue
                        <WarningAmberIcon  />
                    </Button>
                </Box>
        <Box
            sx={{
                display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#819bc5', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        margin: 2,
                        borderRadius: 4, 
            }}
        >
            <Typography variant="h6" color="white" sx={{ p: 2, fontSize: '0.875rem', fontWeight: 'bold' }}>
                Next Deliveries 
            </Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                        top: 0, // Position at the top
                        left: 0, // Align to the left
                        width: 'calc(100% - 32px)', // Full width of the drawer
                        p: 0, // Padding around the text
                        backgroundColor: '#D7E1F0', 
                        justifyContent: 'center', // Horizontally centers the content
                        alignItems: 'center',     // Vertically centers the content
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Optional: adds a bottom border
                        marginLeft: 2,
                        marginBottom: 2,
                        borderRadius: 4, 
            }}
        >
            <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Order ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nextDelRows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.addr}</TableCell>
                                        <TableCell>{row.customer}</TableCell>
                                        <TableCell>{row.orderId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
        </Box>
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{
                        position: 'fixed',
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
            <Modal
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                
            >
                <Fade in={modalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 200,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,
                            textAlign: 'center',
                            borderRadius: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            href="tel:+123456789"
                            fullWidth
                            
                            sx={{ mt: 0 , p: '12px',}}
                        >
                            +1 (234) 567-89
                        </Button>
                    </Box>
                </Fade>
            </Modal>

        </Box>
        
    );
};

export default DriverViewRoutes;