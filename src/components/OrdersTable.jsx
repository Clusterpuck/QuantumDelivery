import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog } from '@mui/material';
import { formatDate } from '../store/helperFunctions';
import EditOrderForm from '../components/EditOrderForm';
import dayjs from 'dayjs';
import { deleteOrder } from '../store/apiFunctions';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';


//update data us a state object that when changed on the parent object
//will trigger a refresh of the orders table data. 
const OrdersTable = ({ orders, onRefresh }) =>
{

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);


    const handleSnackbarClose = () =>
    {
        setSnackbarOpen(false);
    };

    const handleEditClick = (order) =>
    {
        setSelectedOrder(order);
        setOpenEditDialog(true);

    };

    const handleCloseEditDialog = () =>
    {
        setOpenEditDialog(false);
        setSelectedOrder(null);
    };

    const handleDeleteClick = (orderID) =>
    {
        setOrderToDelete(orderID);
        setOpenDeleteDialog(true);
    }

    const handleCancelDelete = () =>
    {
        setOpenDeleteDialog(false);
        setOrderToDelete(null);
    };

    const handleConfirmDelete = async () =>
    {
        try
        {
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
        } catch (error)
        {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');

        } finally
        {
            setSnackbarOpen(true);
            setOpenDeleteDialog(false);
            setOrderToDelete(null);

            setTimeout(() =>
            { // refresh after a delay of 1 second, otherwise the snackbar doesnt show.
                onRefresh();
            }, 1000);
        }
    };

    function Row(props)
    {
        const { row } = props;
        const [open, setOpen] = useState(false);
        return (
            <React.Fragment>
                <TableRow key={row.orderID} sx={{ '& > *': { borderBottom: 'unset' } }}>
                   
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
                        <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    </TableRow>
                    <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                <strong>Products</strong>
                            </Typography>
                            <Table size="small" aria-label="products">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Product Name</strong></TableCell>
                                        <TableCell align="right"><strong>Quantity</strong></TableCell>
                                        <TableCell align="right"><strong>Unit of Measure</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.products.map((product) => (
                                        <TableRow key={product.productID}>
                                            <TableCell component="th" scope="row">
                                                {product.name}
                                            </TableCell>
                                            <TableCell align="right">{product.quantity}</TableCell>
                                            <TableCell align="right">{product.unitOfMeasure || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            </React.Fragment>


        );

    }

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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((row) => (
                            <Row key={row.orderID} row={row}/>
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