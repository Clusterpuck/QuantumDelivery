import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Paper, Snackbar, Alert, Modal, Button, Grid,
    Accordion, AccordionDetails, AccordionSummary,Badge, TextField
 } from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import debounce from 'lodash/debounce';


const Orders = () =>
{
    const [orders, setOrders] = useState([]);
    //const [filteredOrders, setFilteredOrders] = useState(orders);
    const [numOfIssues, setNumberOfIssues] = useState(0);
    const [loadingOrders, setLoadingOrders] = useState(0);
    // State for controlling Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery ] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const refreshOrders = async () =>
    {
        loadOrders();
    };

    const handleShowMessage = (msg, type) => {
        setSnackbar({
            open: true,
            message: msg,
            severity: type
        });
    };


    useEffect(() =>
    {
        enableScroll();
        loadOrders();

    }, []);

   
    const theme = useTheme();


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
        maxHeight: '80%',
        overflowY: 'auto',
    };

    // Open Modal function
    const handleOpenModal = () => setIsModalOpen(true);

    // Close Modal function
    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = useCallback(debounce((event) => {
        setSearchQuery(event.target.value);
    }, 300), []);

    const formatDateForSearch = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}/${month}/${year}`;
    };

    const filteredOrders = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (orders.length > 0) {
            return orders.filter(order => 
                order.orderID.toString().includes(query) ||
                formatDateForSearch(order.deliveryDate).includes(query) ||
                order.address.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.orderNotes.toLowerCase().includes(query) ||
                order.status.toLowerCase().includes(query)
            );
        }
        return orders;
    }, [orders, searchQuery]);

    const loadOrders = async () =>
    {
        setLoadingOrders(true);
        const loadOrders = await fetchMethod("orders/with-products");
        if (loadOrders)
        {
            const filteredOrders = loadOrders.filter(order => order.status !== "CANCELLED");
            setOrders(filteredOrders);

            console.log("Orders received are ", JSON.stringify(filteredOrders));
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
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} mt={4}>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 1500, width: '100%' }}>
        <Grid container>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LibraryAddIcon sx={{ fontSize: 'inherit', marginRight: 1 }} />
                    Orders
                </Typography>
            </Grid>

            {/* <Grid item xs={4} md={4}></Grid> */}
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                {/**Issues table */}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Accordion key={"issuestable"} sx={{ width: '100%' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel--content`}
                            id={`panel--header`}
                            sx={{
                                backgroundColor: theme.palette.primary.mediumaccent,  // Set background color
                                borderBottom: '1px solid grey', // Add a border
                                borderRadius: '8px',
                                margin: 0.5,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.lightaccent, // Hover effect
                                },
                                '& .MuiTypography-root': {
                                    fontWeight: 'bold', // Custom font styles for text
                                    color: theme.palette.text.primary, // Change text color
                                },
                            }}
                        >
                            <Grid item xs={12} md={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Flexbox for inline layout */}
                                    <Badge badgeContent={numOfIssues} color="error">
                                        <SmsFailedIcon color='primary' sx={{ mr: 1 }} />
                                    </Badge>
                                    <Typography ml={1.5} variant="h5" component="h1">
                                        Orders With Issues
                                    </Typography>
                                </Box>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails key={"issues-details"}>


                            <IssuesTable setCount={setNumberOfIssues} showMessage={handleShowMessage} />
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>

            {/**All orders table */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} mt={4}>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 1500, width: '100%' }}>
                    <Grid item xs={12} mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WidgetsIcon sx={{ mr: 1 }} />
                            <Typography variant="h4" component="h1">
                                All Orders
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} mb={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            onChange={handleInputChange}
                        />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                        sx={{ borderRadius: '18px' }}
                    >
                        <AddIcon sx={{ fontSize: '2rem' }} /> Add New Orders
                    </Button>
                    </Grid>

                    <Box sx={{ width: '100%', height: '100%' }}>
                        {loadingOrders ? (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                sx={{ width: '100%', height: '800px' }}
                            />
                        ) : (
                            <OrdersTable orders={filteredOrders} onRefresh={refreshOrders} showMessage={handleShowMessage} />
                        )}
                    </Box>
                </Paper>
            </Box>

            {/* Modal for AddOrderForm */}
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
                                sx={{ fontWeight: 'bold', mb:1 }}
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
                    <AddOrder updateOrders={loadOrders} closeModal={handleCloseModal} showMessage={handleShowMessage} />
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
        </Paper>
        </Box>
    );
};

export default Orders;
