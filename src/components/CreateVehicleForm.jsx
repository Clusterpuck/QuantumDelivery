import React, { useState } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { createVehicle } from '../store/apiFunctions'; 
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const CreateVehicleForm = () => {
    const [formData, setFormData] = useState({
        LicensePlate: '',
        UnitOfMeasure: '',
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
        console.log('Creating vehicle...', formData);

        try {
            const result = await createVehicle({
                LicensePlate: formData.LicensePlate,
            });

            if (result) {
                setSuccess(true);
                setSuccessMessage('Vehicle created successfully!');
                setError(null); 
                console.log('Vehicle created successfully:', result);
            } else {
                setError('Failed to create vehicle.');
            }
        } catch (err) {
            setError('An error occurred while creating the vehicle.');
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                 <Grid container spacing={2} alignItems="center" justifyContent="center">
                <LocalShippingIcon sx={{ mr: 1 }} /> {/* Adds margin to the right of the icon */}
                                <Typography margin={1} variant="h4">
                                    Add Vehicle
                                </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    label="License Plate"
                                    name="LicensePlate"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.LicensePlate}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Create Vehicle
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">{successMessage}</Typography>}
                        </Grid>
                    </form>
                </Grid>
        </Box>
    );
};

export default CreateVehicleForm;
