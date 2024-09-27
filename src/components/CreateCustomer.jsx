import React, { useState } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { createCustomer } from '../store/apiFunctions'; 

const CreateCustomerForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Creating customer...', formData);

        try {
            const result = await createCustomer({
                Name: formData.customerName,
                Email: formData.customerEmail,
                Phone: formData.customerPhone,
            });

            if (result) {
                setSuccess(true);
                setSuccessMessage('Customer created successfully!');
                setError(null); 
                console.log('Customer created successfully:', result);
            } else {
                setError('Failed to create customer.');
            }
        } catch (err) {
            setError('An error occurred while creating the customer.');
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Customer Name"
                                    name="customerName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Customer Email"
                                    name="customerEmail"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.customerEmail}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Customer Phone"
                                    name="customerPhone"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.customerPhone}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Create Customer
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">{successMessage}</Typography>}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default CreateCustomerForm;
