import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Paper, Box, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Dialog,
    Tooltip, Checkbox, FormControlLabel, Grid} from '@mui/material';
import { formatDate } from '../store/helperFunctions';
import EditOrderForm from '../components/EditOrderForm';
import dayjs from 'dayjs';
import { deleteOrder } from '../store/apiFunctions';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const statusOptions = ["PLANNED", "ON-ROUTE", "DELIVERED", "CANCELLED", "ASSIGNED", "ISSUE"];
 // Mapping header names to JSON keys
 const headerMapping = {
    'ID': 'orderID',
    'Date': 'deliveryDate',
    'Address': 'address',
    'Customer': 'customerName',
    'Status': 'status',
    'Notes': 'orderNotes',
    'Action': '',
    '':'',
};

// Disabled order statuses by default
const disabledStatuses = ["DELIVERED", "CANCELLED"];

const headerWidths = {
    'ID': '10%',
    'Date': '10%',
    'Address': '20%',
    'Customer': '15%',
    'Status': '5%',
    'Notes': '33%',
    'Action': '5%',
    '':'2%',
}

const OrdersTable = ({ orders, onRefresh, showMessage }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [sortBy, setSortBy] = useState('deliveryDate'); // Default sort by deliveryDate
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedStatuses, setSelectedStatuses] = useState(
        statusOptions.filter(status => !disabledStatuses.includes(status)) // Exclude "DELIVERED" and "CANCELLED"
    );
    //const [filteredData, setFilteredData] = useState(orders);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setOpenEditDialog(true);
    };

    const handleToggleStatus = (status) => {
        const updatedStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter(s => s !== status)
            : [...selectedStatuses, status];
    
        setSelectedStatuses(updatedStatuses);
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

    const visibleRows = React.useMemo(() => {
        if( orders )
        {
            // First filter the rows based on the selected statuses
            const filteredRows = orders.filter((item) => selectedStatuses.includes(item.status));
            
            // Then sort the filtered rows
            return filteredRows.sort(getComparator(sortDirection, sortBy));

        }
        return [];
    }, [orders, selectedStatuses, sortDirection, sortBy]);
    

    

    const handleConfirmDelete = async () => {
        try {
            const orderDeleted = await deleteOrder(orderToDelete);
            if (orderDeleted) {
                showMessage('Order deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete order.');
            }
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            showMessage(error.message, 'error');
        } finally {
            setOpenDeleteDialog(false);
            setOrderToDelete(null);
            onRefresh();
        }
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = sortBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

   

   
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = useState(false);
        const isButtonDisabled = row.status !== 'ISSUE' && row.status !== 'PLANNED';
        const tooltipText = isButtonDisabled ? "Only available for orders with status 'issue' or 'planned'" : '';

        return (
            <React.Fragment>
                <TableRow hover key={row.orderID} sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.orderID}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>{dayjs(row.deliveryDate).format('DD/MM/YY')}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.address}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.customerName}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.status}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>{row.orderNotes}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid grey' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title={tooltipText} arrow>
                                <span>
                                    <Button
                                        size="small"
                                        variant="outlined"
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
                                        variant="outlined"
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
              <Grid container alignItems="flex-start" justifyContent="flex-start"> {/* Reduce spacing and align items */}
        {statusOptions.map((status, index) => (
            <Grid item xs={4} md={2} key={status} sx={{ textAlign: 'left' }}> {/* Ensure items are left-aligned */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedStatuses.includes(status)}
                            onChange={() => handleToggleStatus(status)}
                            size="small" // Reduce size if you want them smaller
                        />
                    }
                    label={status}
                    sx={{ marginRight: 0 }}
                />
            </Grid>
        ))}
    </Grid>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            {Object.keys(headerMapping).map((header) => (
                                <TableCell 
                                    key={header} 
                                    sx={{ borderBottom: '2px solid #582c4d', width: headerWidths[header] || 'auto' }} 
                                    onClick={(event) => handleRequestSort(event, headerMapping[header])}
                                >
                                    {header}
                                     {/* Show ▲ or ▼ based on sorting state */}
                                    {header !== 'Action' && header !== '' && sortBy === headerMapping[header]
                                        ? (sortDirection === 'asc' ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>)
                                        : header !== 'Action' && header !== '' 
                                        ? <SwapVertIcon/>
                                        : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => (
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
            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} maxWidth>
                <Box sx={{ p: 2 }}>
                    <Typography>Are you sure you want to delete this order?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button onClick={handleCancelDelete}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export default OrdersTable;
