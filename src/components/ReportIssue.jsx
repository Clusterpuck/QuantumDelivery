import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography } from '@mui/material';
import { updateOrderDelayed } from '../store/apiFunctions.js';
import ErrorIcon from '@mui/icons-material/Error';
import '../index.css';

const ReportIssue = ({ open, onClose, driverUsername, orderId, fetchDeliveryData }) => {
    const [error, setError] = React.useState(null);
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
                console.log("successfully set order to delayed");
                await fetchDeliveryData();
            } else {
                throw new Error("failed to update order status");
            }
        } catch (err) {
            console.error("error updating order to delayed:", err);
            setError("Error: Could not submit issue.");
        }
    }

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
                    <Button 
                        variant="outlined" 
                        onClick={handleOrderDelayed}
                        fullWidth
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