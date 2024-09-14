import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material';

const ReportIssue = ({ open, onClose }) => {
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
                    <Button 
                        variant="outlined" 
                        onClick={() => {
                            console.log("Order is delayed");
                            onClose();
                        }}
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