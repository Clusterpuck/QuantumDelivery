import React, { useEffect, useState, useCallback } from 'react';
import { fetchMethod } from '../store/apiFunctions';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box } from '@mui/material';

//update data us a state object that when changed on the parent object
//will trigger a refresh of the orders table data. 
const OrdersTable = ({updateData}) => {

    const [orders, setOrders] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const loadOrders = useCallback(async () => {
        const orderList = await fetchMethod("orders");
        if (orderList) {
            setOrders(orderList);
        } else {
            console.error('Error fetching orders:', error);
            setSnackbarMessage('Failed to load orders');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, []);

    useEffect(() => {
        
        loadOrders();

    }, [updateData, loadOrders])

    // Function to format the date
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB'); // Format as MM/DD/YYYY
        // For DD/MM/YYYY use 'en-GB'
    }

    
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'DeliveryDate', headerName: 'Date', width: 150 },
        { field: 'Address', headerName: 'Address', width: 180 },
        { field: 'customerName', headerName: 'Customer Name', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 150 },
    ];

    // The rows should be based on the fetched orders data
    const rows = orders.map(order => ({
        id: order.orderId,
        Address: order.addr,
        status: order.status,
        customerName: order.customerName,
        notes: order.notes,
        DeliveryDate: formatDate(order.deliveryDate),

    }));

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
            <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
                 <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                    <DataGrid 
                        rows={rows} 
                        columns={columns} 
                        pageSize={10} 
                    />
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            </Paper>
    );

}

export default OrdersTable;