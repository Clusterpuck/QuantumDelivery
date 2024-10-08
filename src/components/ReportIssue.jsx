import React, {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography,
    IconButton, TextField } from '@mui/material';
import { updateOrderDelayed, updateOrderIssue } from '../store/apiFunctions.js';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import '../index.css';

const ReportIssue = ({ open, onClose, driverUsername, order, fetchDeliveryData, showMessage}) => {
    const [isDelayed, setIsDelayed] = useState(order?.delayed);
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
                console.log("about to call show message");
                showMessage('Delay reported successfully. Thank you!', 'success');
                setIsDelayed(true); 
                await fetchDeliveryData();
                onClose();
            } else {
                throw new Error("Failed to update order status");
            }
        } catch (err) {
            showMessage("Failed to update order to delayed", 'error');
            onClose();
        }
    }

    const handleOrderIssueSubmit = async () => {
        const input = {
            username: driverUsername,
            orderID: order.orderID,
            driverNote: issueNote,
        };

        try {
            const result = await updateOrderIssue(input);
            if (result) {
                showMessage('Issue reported successfully. Thank you!', 'success');
                setIsIssueOpen(false); // Close the issue box after submission
                setIsIssueSubmitted(true);
                await fetchDeliveryData();
                onClose();
            } else {
                throw new Error("Failed to report issue");
            }
        } catch (err) {
            console.error("Error reporting issue:", err);
            onClose();
        }
    };

    useEffect(() => { //reset success / error messages when dialog reopens
        if (open) {
            setIsDelayed(order?.delayed);
            setIsIssueOpen(false); 
            setIssueNote(''); 
            setIsIssueSubmitted(false);
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ 
            marginTop: 3
        }}>What type of issue would you like to report?</DialogTitle>
            <IconButton 
                color="primary"
                aria-label="cancel" 
                onClick={onClose}  // Handle cancel action
                sx={{ position: 'absolute', top: 8, right: 8}}  // Top-right positioning
            >
                <CancelIcon />
            </IconButton>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column', 
                        gap: 2, 
                        width: '100%',
                        marginTop: 0
                    }}
                >
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