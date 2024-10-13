import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { getCustomerDetails, updateCustomer } from '../store/apiFunctions'; 

const EditCustomerForm = ({ customerId, onClose }) => {
    const [formData, setFormData] = useState({
        Name: '',
        Phone: '',
        Email: '',
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
                        Email: customerData.email || '',
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
        setError(null);
        setSuccess(false);
        console.log('Saving changes...', formData); 

        try {
            
            if (!/^(?:(?:\+61|0)4\d{2} ?\d{3} ?\d{3}|(?:\+61|0)(2|3|7|8)\d{8}|(?:\+61|0)1800 ?\d{3} ?\d{3}|(?:\+61|0)13\d{6}|(?:\+61|0)1900 ?\d{6})$/.test(formData.Phone)) {
                setError('Phone number is invalid')
                return;
            }

            const result = await updateCustomer(customerId, formData); // Update customer in DB

            if (result) {
                setSuccess(true);
                if (!formData.Name || !formData.Phone) {
                    setError("Both fields are required.");
                    return;
                }
                setSuccessMessage('Customer updated successfully!');
                onClose();
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
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Typography variant="h5" margin={1}>
                        Editing Customer 
                    </Typography>
                    <Typography variant='subheading'>
                        {customerId}
                    </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Customer Email"
                                    name="Email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Email}
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
        </Box>
    );
};

export default EditCustomerForm;
