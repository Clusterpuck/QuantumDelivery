import React, {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography, TextField } from '@mui/material';
import { updateOrderDelayed, updateOrderIssue } from '../store/apiFunctions.js';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../index.css';

const ReportIssue = ({ open, onClose, driverUsername, order, fetchDeliveryData}) => {
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const [isDelayed, setIsDelayed] = useState(order.delayed);
    const [isIssueOpen, setIsIssueOpen] = useState(false); // for the message box when a driver reports an issue.
    const [issueNote, setIssueNote] = useState(''); // issue note
    const [isIssueSubmitted, setIsIssueSubmitted] = useState(false);

    const handleOrderDelayed = async () => 
    {
        const input = {
            username: driverUsername,
            orderID: order.orderID,
            delayed: "true"
        };

        try {
            const result = await updateOrderDelayed(input);
            if (result) {
                console.log("Successfully set order to delayed");
                setSuccess('Delay reported successfully. Thank you!');  // set success message
                setError(null);  // clear any previous error messages
                setIsDelayed(true); 
                await fetchDeliveryData();
            } else {
                throw new Error("Failed to update order status");
            }
        } catch (err) {
            console.error("Error updating order to delayed:", err);
            setError("Something went wrong. Failed to submit delay report.");
            setSuccess(null);  // clear any success messages if error occurs
        }
    }

    const handleOrderIssueSubmit = async () => {
        const input = {
            username: driverUsername,
            orderID: order.orderID,
            driverNote: issueNote,
        };

        console.log("ISSUE LOG: ", input);

        try {
            const result = await updateOrderIssue(input);
            if (result) {
                console.log("Successfully reported issue with the order");
                setSuccess('Issue reported successfully. Thank you!');
                setError(null);
                setIsIssueOpen(false); // Close the issue box after submission
                setIsIssueSubmitted(true);
                await fetchDeliveryData();
            } else {
                throw new Error("Failed to report issue");
            }
        } catch (err) {
            console.error("Error reporting issue:", err);
            setError("Something went wrong. Failed to submit the issue.");
            setSuccess(null);
        }
    };

    useEffect(() => { //reset success / error messages when dialog reopens
        if (open) {
            setSuccess(null);
            setError(null);
            setIsDelayed(order.delayed);
            setIsIssueOpen(false); // reset issue box state when the dialog reopens
            setIssueNote(''); 
            setIsIssueSubmitted(false);
        }
    }, [open]);

    useEffect(() =>
    {
        console.log("ISDELAYED ", isDelayed )
    }
    , [isDelayed]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>What type of issue would you like to report?</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column', 
                        gap: 2, 
                        width: '100%',
                        marginTop: 2
                    }}
                >
                    {error && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 2,
                                borderRadius: 1,
                                backgroundColor: 'var(--action-colour)',
                            }}
                        >
                            <ErrorIcon sx={{ color: 'var(--secondary-colour)' }}/>
                            <Typography variant="body2" sx={{ marginLeft: 1, color: 'var(--secondary-colour)' }}>
                                {error}
                            </Typography>
                        </Box>
                    )}
                    {success && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 2,
                                borderRadius: 1,
                                backgroundColor: 'var(--action-colour)', 
                            }}
                        >
                            <CheckCircleIcon sx={{ color: 'var(--secondary-colour)' }} />
                            <Typography variant="body2" sx={{ marginLeft: 1, color: 'var(--secondary-colour)' }}>
                                {success}
                            </Typography>
                        </Box>
                    )}
                    <Button 
                        variant="outlined" 
                        onClick={handleOrderDelayed}
                        fullWidth
                        disabled={isDelayed || isIssueSubmitted}
                    >
                        Order is delayed
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => setIsIssueOpen(true)}
                        fullWidth
                        disabled={isIssueSubmitted}
                    >
                        Order could not be delivered
                    </Button>
                    {isIssueOpen && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1">Please provide a note about the issue:</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={issueNote}
                                onChange={(e) => setIssueNote(e.target.value)}
                                placeholder="Describe the issue"
                                sx={{ mt: 2 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleOrderIssueSubmit}
                                sx={{ mt: 2 }}
                                fullWidth
                                disabled={isIssueSubmitted || !issueNote}
                            >
                                Submit Issue
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReportIssue;