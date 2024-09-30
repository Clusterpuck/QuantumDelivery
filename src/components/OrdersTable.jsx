import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert, Paper, Box, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Dialog,
    Tooltip} from '@mui/material';
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
const OrdersTable = ({ orders, onRefresh, showMessage }) =>
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
                showMessage('Order deleted successfully!', 'success');
            }
            else
            {
                throw new Error('Failed to delete order.');
            }
        } catch (error)
        {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            showMessage(error.message, 'error');

        } finally
        {
            setOpenDeleteDialog(false);
            setOrderToDelete(null);
            onRefresh();
        }
    };

    function Row(props)
    {
        const { row } = props;
        const [open, setOpen] = useState(false);
        const isButtonDisabled = row.status !== 'ISSUE' && row.status !== 'PLANNED';
        const tooltipText = isButtonDisabled ? "Only available for orders with status 'issue' or 'planned'" : '';
        return (
            <React.Fragment>
                <TableRow key={row.orderID} sx={{ '& > *': { borderBottom: 'unset' } }}>
                   
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.orderID}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{dayjs(row.deliveryDate).format('DD/MM/YY')}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.address}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.customerName}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.status}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.orderNotes}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid grey' }}>
                                <Box sx={{ display: 'flex', gap: 1 }}> {/* Add gap for spacing between buttons */}
                                    <Tooltip title={tooltipText} arrow>
                                <span>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditClick(row)}
                                        disabled={isButtonDisabled}
                                    >
                                        Edit
                                    </Button>
                                </span>
                            </Tooltip>
                            <Tooltip title={tooltipText} arrow>
                                <span>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteClick(row.orderID)}
                                        disabled={isButtonDisabled}
                                    >
                                        Delete
                                    </Button>
                                </span>
                            </Tooltip>
                                </Box>
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
                                    {row.products && row.products.map((product) => (
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
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                        {['ID', 'Date', 'Address', 'Customer Name', 'Status', 'Notes', 'Actions', ''].map((header) => (
                    <TableCell key={header} sx={{ borderBottom: '2px solid #582c4d' }}>{header}</TableCell>
                ))}
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
                <EditOrderForm order={selectedOrder} onClose={handleCloseEditDialog} onRefresh={onRefresh} showMessage={showMessage} />
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