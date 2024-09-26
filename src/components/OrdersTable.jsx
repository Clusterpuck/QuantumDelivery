import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog } from '@mui/material';
import { formatDate } from '../store/helperFunctions';
import EditOrderForm from '../components/EditOrderForm';
import dayjs from 'dayjs';
import { deleteOrder } from '../store/apiFunctions';


//update data us a state object that when changed on the parent object
//will trigger a refresh of the orders table data. 
const OrdersTable = ({ orders, onRefresh }) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);


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

    const handleDeleteClick = (orderID) => {
        setOrderToDelete(orderID);
        setOpenDeleteDialog(true);
    }

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setOrderToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const orderDeleted = await deleteOrder(orderToDelete);
            if (orderDeleted)
            {
            setSnackbarMessage('Order deleted successfully!');
            setSnackbarSeverity('success');
            }
            else
            {
            throw new Error('Failed to delete order.');
            }
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            
        } finally {
            setSnackbarOpen(true);
            setOpenDeleteDialog(false);
            setOrderToDelete(null);

            setTimeout(() => { // refresh after a delay of 1 second, otherwise the snackbar doesnt show.
                onRefresh();
            }, 1000); 
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer component={Paper} sx={{ maxHeight: 800 }}>
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
                                        <Box sx={{ display: 'flex', gap: 1 }}> {/* Add gap for spacing between buttons */}
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditClick(row)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDeleteClick(row.orderID)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
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
            <Dialog open={openDeleteDialog} >
                <Box sx={{ padding: 2 }}>
                    <p>Are you sure you want to delete order {orderToDelete}?</p>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export default OrdersTable;