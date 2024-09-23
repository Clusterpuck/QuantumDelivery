import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog } from '@mui/material';
import {formatDate} from '../store/helperFunctions';
import EditOrderForm from '../components/EditOrderForm';
import dayjs from 'dayjs';

//update data us a state object that when changed on the parent object
//will trigger a refresh of the orders table data. 
const OrdersTable = ({orders, onRefresh }) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setOpenEditDialog(true);
        
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedOrder(null); 
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell >ID</TableCell>
                            <TableCell >Date</TableCell>
                            <TableCell >Address</TableCell>
                            <TableCell >Customer Name</TableCell>
                            <TableCell >Status</TableCell>
                            <TableCell >Notes</TableCell>
                            <TableCell >Actions</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((row) => (
                            <TableRow key={row.orderID}>
                                <TableCell>{row.orderID}</TableCell>
                                <TableCell>{dayjs(row.deliveryDate).format('DD/MM/YY')}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.customerName}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.orderNotes}</TableCell>
                                <TableCell>
                                    {(row.status === 'ISSUE' || row.status === 'PLANNED') && (
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleEditClick(row)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth>
                <EditOrderForm order={selectedOrder} onClose={handleCloseEditDialog} onRefresh={onRefresh} />
            </Dialog>
        </Box>
    );
};

export default OrdersTable;