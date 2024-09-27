import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { getCustomerDetails, updateCustomer } from '../store/apiFunctions'; // Replace with the actual API functions

const EditCustomerForm = ({ customerId }) => {
    const [formData, setFormData] = useState({
        Name: '',
        Phone: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const customerData = await getCustomerDetails(customerId); // Fetch customer details
                if (customerData) {
                    setFormData({
                        Name: customerData.name || '',
                        Phone: customerData.phone || '',
                    });
                } else {
                    setError('No customer details found.');
                }
            } catch (error) {
                console.error(`Error fetching customer details for ID: ${customerId}`, error);
                setError('Failed to load customer data, no customer found.');
            }
        };

        fetchCustomerData();
    }, [customerId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Saving changes...', formData); 

        try {
            const result = await updateCustomer(customerId, formData); // Update customer in DB

            if (result) {
                setSuccess(true);
                if (!formData.Name || !formData.Phone) {
                    setError("Both fields are required.");
                    return;
                }
                setSuccessMessage('Customer updated successfully!');
                console.log('Customer updated successfully:', result);
            } else {
                setError('Failed to update customer.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating the customer.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        Editing Customer {customerId}
                    </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Customer Name"
                                    name="Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone Number"
                                    name="Phone"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Phone}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Save Changes
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

export default EditCustomerForm;
