import React, { useState } from 'react';
import { TextField, Box, CircularProgress, Button, Grid, Typography } from '@mui/material';
import { createVehicle } from '../store/apiFunctions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const CreateVehicleForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        LicensePlate: '',
        Make: '',
        Model: '',
        Colour: '',
        Capacity: 0,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        setLoadingSubmit(true);
        event.preventDefault();
        console.log('Creating vehicle...', formData);

        try {
            const result = await createVehicle(formData);

            if (result && result.licensePlate) {
                setSuccess(true);
                setSuccessMessage('Vehicle created successfully!');
                onClose();
            } else {
                setError('Failed to create vehicle.');
            }
        } catch (err) {
            if (err.message.includes("409")) {
                setError(`Vehicle with license plate '${formData.licensePlate}' already exists.`);
            } else {
                setError('An error occurred while creating the vehicle.');
            }
            console.error('Error creating vehicle:', err);
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <Typography variant="h5" gutterBottom>
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Make"
                                name="Make"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.Make}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Model"
                                name="Model"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.Model}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Colour"
                                name="Colour"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.Colour}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Capacity"
                                name="Capacity"
                                type="number"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.Capacity}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                            {loadingSubmit ? <CircularProgress color="secondary" size={24} /> : "Add Vehicle"}
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
