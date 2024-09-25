import React, { useEffect, useState } from 'react';
import { Box, Paper, Snackbar, Alert, Divider, Modal, Button, Grid } from '@mui/material';
import OrdersTable from '../components/OrdersTable.jsx';
import Typography from '@mui/material/Typography';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import 'dayjs/locale/en-gb';
import { fetchMethod } from '../store/apiFunctions.js';
import Skeleton from '@mui/material/Skeleton';
import IssuesTable from '../components/IssuesTable.jsx';
import { enableScroll } from '../assets/scroll.js';
import AddOrder from '../components/AddOrder.jsx';
import AddIcon from '@mui/icons-material/Add'; // Add Icon
import CancelIcon from '@mui/icons-material/Cancel';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import WidgetsIcon from '@mui/icons-material/Widgets';


const Orders = () =>
{
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(0);
    // State for controlling Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const refreshOrders = async () =>
    {
        loadOrders();
    };

    useEffect(() =>
    {
        enableScroll();
        loadOrders();

    }, []);


    // Modal Style
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

    // Open Modal function
    const handleOpenModal = () => setIsModalOpen(true);

    // Close Modal function
    const handleCloseModal = () => setIsModalOpen(false);



    const loadOrders = async () =>
    {
        setLoadingOrders(true);
        const loadOrders = await fetchMethod("orders/with-products");
        if (loadOrders)
        {
            const filteredOrders = loadOrders.filter(order => order.status !== "CANCELLED");
            setOrders(filteredOrders);

            console.log("Orders recieved are ", JSON.stringify(filteredOrders));
        } else
        {
            console.error('Error fetching orders:', error);
            setSnackbarMessage('Failed to load orders');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        setLoadingOrders(false);
    }


    const handleSnackbarClose = () =>
    {
        setSnackbar(prev => ({ ...prev, open: false }));
    };




    return (
        <Grid container>

            {/* <Grid item xs={4} md={4} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    sx={{ borderRadius: '18px' }}
                >
                    <AddIcon sx={{ fontSize: '2rem' }} /> Add New Orders
                </Button>
            </Grid> */}


            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h3" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LibraryAddIcon sx={{ fontSize: 'inherit', marginRight: 1 }} />
                    Orders
                </Typography>
            </Grid>

            <Grid item xs={4} md={4}></Grid>

            {/**Issues table */}
            <Box maxHeight='30%' sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 1500, width: '100%' }}>
                {/* <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    sx={{ borderRadius: '18px' }}
                >
                    <AddIcon sx={{ fontSize: '2rem' }} /> Add New Orders
                </Button>
            </Grid> */}
                    <Grid item xs={12} md={12} mb={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Flexbox for inline layout */}
                            <SmsFailedIcon sx={{ mr: 1 }} /> {/* Add margin to the right of the icon */}
                            <Typography variant="h4" component="h1">
                                Orders With Issues
                            </Typography>
                        </Box>
                    </Grid>
                    <IssuesTable />
                </Paper>
            </Box>

            {/**All orders table */}
            <Box maxHeight='70%' sx={{ display: 'flex', justifyContent: 'center' }} marginTop={4}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 1500, width: '100%' }}>
                <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    sx={{ borderRadius: '18px' }}
                >
                    <AddIcon sx={{ fontSize: '2rem' }} /> Add New Orders
                </Button>
            </Grid>
                <Grid item xs={12} md={12} mb={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Flexbox for inline layout */}
                            <WidgetsIcon sx={{ mr: 1 }} /> {/* Add margin to the right of the icon */}
                            <Typography variant="h4" component="h1">
                                All Orders
                            </Typography>
                        </Box>
                    </Grid>
                    <Box sx={{ height: '100%', width: '100%' }}>

                        {loadingOrders ?
                            (<Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />) :
                            (<OrdersTable orders={orders} onRefresh={refreshOrders} />)}
                    </Box>
                </Paper>
            </Box>

            {/* Modal for AddRouteForm */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-order-modal"
                aria-describedby="add-order-form"
            >
                <Box sx={modalStyle}>
                    <Grid container alignItems="center">  {/* Use Grid container to align items */}
                        <Grid item xs={10}>  {/* Use 10 units for the title */}
                            <Typography
                                id="add-route-modal"
                                variant="h6"
                                component="h2"
                                align="left"  // Align text to the left
                                sx={{ fontWeight: 'bold', mb: 1 }}
                            >
                                Add Orders
                            </Typography>
                        </Grid>
                        <Grid item xs={2} textAlign="right">  {/* Use 2 units for the button */}
                            <Button onClick={handleCloseModal}>
                                <CancelIcon />
                            </Button>
                        </Grid>
                    </Grid>
                    <AddOrder updateOrders={loadOrders} />
                </Box>
            </Modal>

            <Snackbar
                open={snackbar.open}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>


        </Grid>
    );
};

export default Orders;