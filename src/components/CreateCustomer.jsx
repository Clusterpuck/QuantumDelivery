import React, { useState } from 'react';
import { TextField, Box, CircularProgress, Button, Grid, Typography } from '@mui/material';
import { createCustomer } from '../store/apiFunctions'; 
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const CreateCustomerForm = ( { onClose } ) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        setLoadingSubmit(true)
        event.preventDefault();
        console.log('Creating customer...', formData);

        const newCustomer = {
            Name: formData.customerName,
            Email: formData.customerEmail,
            Phone: formData.customerPhone,
        };
        
        if (!/^(?:(?:\+61|0)4\d{2} ?\d{3} ?\d{3}|(?:\+61|0)(2|3|7|8)\d{8}|(?:\+61|0)1800 ?\d{3} ?\d{3}|(?:\+61|0)13\d{6}|(?:\+61|0)1900 ?\d{6})$/.test(newCustomer.Phone)) {
            setError('Phone number is invalid')
            setLoadingSubmit(false);
            return;
        }

        try {
            const result = await createCustomer(newCustomer);

            if (result) {
                setSuccess(true);
                setSuccessMessage('Customer created successfully!');
                onClose();
                setError(null); 
                console.log('Customer created successfully:', result);
            } else {
                setError('Failed to create customer.');
            }
        } catch (err) {
            setError('An error occurred while creating the customer.');
            console.error(err);
        } finally{
            setLoadingSubmit(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={12} container alignItems="center" justifyContent="center">
                                <SupportAgentIcon sx={{ mr: 1 }} /> {/* Adds margin to the right of the icon */}
                                <Typography variant="h5">
                                    Add Customer
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
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
                            {loadingSubmit ? <CircularProgress color="secondary" size = {24}/> :  "Add Customer" }
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">{successMessage}</Typography>}
                        </Grid>
                    </form>
                </Grid>
        </Box>
    );
};

export default CreateCustomerForm;
