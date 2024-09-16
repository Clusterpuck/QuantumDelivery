import React, {useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography } from '@mui/material';
import { updateOrderDelayed } from '../store/apiFunctions.js';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../index.css';

const ReportIssue = ({ open, onClose, driverUsername, orderId, fetchDeliveryData, delay }) => {
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const [isDelayed, setIsDelayed] = useState(delay);

    const handleOrderDelayed = async () => 
    {
        const input = {
            username: driverUsername,
            orderID: orderId,
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

    useEffect(() => { //reset success / error messages when dialog reopens
        if (open) {
            setSuccess(null);
            setError(null);
            setIsDelayed(delay);
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
                        disabled={isDelayed}
                    >
                        Order is delayed
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => {
                            console.log("Order could not be delivered");
                            onClose();
                        }}
                        fullWidth
                    >
                        Order could not be delivered
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReportIssue;