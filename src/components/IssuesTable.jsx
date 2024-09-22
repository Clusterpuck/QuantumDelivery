import React, { useEffect, useState } from 'react';
import { fetchIssueOrders } from '../store/apiFunctions';
import {
    Dialog, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Skeleton
} from '@mui/material';
import '../index.css';
import EditOrderForm from '../components/EditOrderForm';


const IssuesTable = () => {
    const [issueOrders, setIssueOrders] = useState([]);
    const [loadingIssues, setLoadingIssues] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false);;
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchIssues = async () => {
        try {
            setLoadingIssues(true)
            const issueData = await fetchIssueOrders();
            if (issueData) {
                setIssueOrders(issueData);
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

    const TableOfIssues = () => {
        if (loadingIssues) {
            return (
                <Skeleton sx={{
                    width: '100%',  // Make it responsive to parent container
                    height: '100px', // Auto-adjust height for responsiveness
                }} />
            )
        }
        else if (issueOrders.length > 0) {
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
                        {issueOrders.map((order) => (
                            <TableRow key={order.orderID}>
                                <TableCell>{order.orderID}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.customerPhone}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.products.map(product => product.name).join(', ')}</TableCell>
                                <TableCell>{order.orderNotes}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditClick(order)}
                                    >
                                        Edit
                                    </Button>
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
        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
            <TableContainer component={Paper}>

                <TableOfIssues />
            </TableContainer>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth>
                <EditOrderForm order={selectedOrder} onClose={handleCloseEditDialog} />
            </Dialog>
        </Paper>
    );
};
export default IssuesTable;
