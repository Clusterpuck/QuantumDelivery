import React, { useEffect} from 'react';
import { fetchIssueOrders } from '../store/apiFunctions';
import {Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button,
} from '@mui/material';
import '../index.css';

const IssuesTable = () => {
    const [issueOrders, setIssueOrders] = React.useState([]);

    const fetchIssues = async () => {
        try {
            const issueData = await fetchIssueOrders();
            if (issueData) {
                setIssueOrders(issueData);
            } else {
                console.error("No orders with issues data returned.");
            }
        } catch (error) {
            console.error("Error fetching orders with issues: ", error);
        }
    };

    const handleResolve = (orderID) => {
        // insert logic for resolving issue
        console.log(`Resolving issue for order ID: ${orderID}`);
    };

    useEffect(() => {
        fetchIssues();
    })

    return (
        <Paper elevation={3} sx={{ padding: 3, width: '100vw' }}>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{backgroundColor: 'var(--background-colour)'}}>
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
                    {issueOrders.length > 0 ? (
                        issueOrders.map((order) => (
                            <TableRow key={order.orderID}>
                                <TableCell>{order.orderID}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.customerPhone}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.productNames.join(', ')}</TableCell>
                                <TableCell>{order.orderNotes}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleResolve(order.orderID)}
                                    >
                                        Resolve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No orders with issues found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    );
};
export default IssuesTable;
