import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box } from '@mui/material';
import {formatDate} from '../store/helperFunctions';

//update data us a state object that when changed on the parent object
//will trigger a refresh of the orders table data. 
const OrdersTable = ({orders}) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.05 },
        { field: 'DeliveryDate', headerName: 'Date', flex: 0.15 },
        { field: 'Address', headerName: 'Address', flex: 0.2 },
        { field: 'customerName', headerName: 'Customer Name', flex: 0.1 },
        { field: 'status', headerName: 'Status', flex: 0.2 },
        { field: 'notes', headerName: 'Notes', flex: 0.3 },
    ];
    

    // The rows should be based on the fetched orders data
    const rows = orders?.map(order => ({
        id: order.orderID,
        Address: order.address,
        status: order.status,
        customerName: order.customerName,
        notes: order.orderNotes,
        DeliveryDate: formatDate(order.deliveryDate),
        Products: order.productNames,

    }));

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ height: 400, width: '100%' }}>

            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}

            />
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
        </Box>
    );

}

export default OrdersTable;