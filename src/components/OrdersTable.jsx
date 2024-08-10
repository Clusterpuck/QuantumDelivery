import React, { useEffect, useState, useCallback } from 'react';
import { fetchMethod } from '../store/apiFunctions';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box } from '@mui/material';

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

    
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'dateOrdered', headerName: 'Date Ordered', width: 180 },
        { field: 'orderNotes', headerName: 'Order Notes', width: 200 },
        { field: 'customerId', headerName: 'Customer ID', width: 150 },
        { field: 'locationId', headerName: 'Location ID', width: 150 },
        { field: 'deliveryRouteId', headerName: 'Delivery Route ID', width: 180 },
        { field: 'positionNumber', headerName: 'Position Number', width: 180 }
    ];

    // The rows should be based on the fetched orders data
    const rows = orders.map(order => ({
        id: order.id,
        dateOrdered: order.dateOrdered,
        orderNotes: order.orderNotes,
        customerId: order.customerId,
        locationId: order.locationId,
        deliveryRouteId: order.deliveryRouteId,
        positionNumber: order.positionNumber
    }));

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 1200, width: '100%' }}>
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