import React, { useEffect, useState } from 'react';
import { fetchIssueOrders } from '../store/apiFunctions';
import {
    Box, Snackbar, Alert, Dialog, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Skeleton
} from '@mui/material';
import '../index.css';
import EditOrderForm from '../components/EditOrderForm';
import { deleteOrder } from '../store/apiFunctions';


const IssuesTable = ({setCount}) => {
    const [issueOrders, setIssueOrders] = useState([]);
    const [loadingIssues, setLoadingIssues] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchIssues = async () => {
        try {
            setLoadingIssues(true)
            const issueData = await fetchIssueOrders();
            if (issueData) {
                setIssueOrders(issueData);
                setCount(issueData.length);
            } else {
                console.error("No orders with issues data returned.");
            }
        } catch (error) {
            console.error("Error fetching orders with issues: ", error);
        } finally {
            setLoadingIssues(false);
        }
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
            fetchIssues();
            setOrderToDelete(null);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const TableOfIssues = () => {
        if (loadingIssues) {
            return (
                <Skeleton sx={{
                    width: '100%',  // Make it responsive to parent container
                    height: '400px', // Auto-adjust height for responsiveness
                }} />
            )
        }
        else if (issueOrders.length > 0) {
            return (
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'var(--background-colour)' }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Customer Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issueOrders.map((order) => (
                            <TableRow key={order.orderID}>
                                <TableCell>{order.orderID}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.customerPhone}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.products.map(product => product.name).join(', ')}</TableCell>
                                <TableCell>{order.orderNotes}</TableCell>
                                <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}> 
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEditClick(order)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDeleteClick(order.orderID)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )

        } else {
            return (
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'var(--background-colour)' }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Customer Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No orders with issues found.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )

        }

    }

    useEffect(() => {
        fetchIssues();
    }, [])

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
           <TableContainer component={Paper} sx={{ width: '100%', maxHeight: 400 }}>

                <TableOfIssues />
            </TableContainer >
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
                <EditOrderForm order={selectedOrder} onClose={handleCloseEditDialog} onRefresh={fetchIssues} />
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
export default IssuesTable;
