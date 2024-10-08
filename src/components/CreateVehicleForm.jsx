import React, { useState } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { createVehicle } from '../store/apiFunctions'; 

const CreateVehicleForm = () => {
    const [formData, setFormData] = useState({
        licensePlate: '',
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
                LicensePlate: formData.licensePlate,
            });
    
            // Explicitly check if the result contains the expected data
            if (result && result.licensePlate) {  // Ensure licensePlate exists in the result
                setSuccess(true);
                setSuccessMessage('Vehicle created successfully!');
                setError(null);  // Clear any previous errors
                console.log('Vehicle created successfully:', result);
            } else {
                setError('Failed to create vehicle.');  // Handle unexpected API response
            }
        } catch (err) {
            if (err.message.includes("409")) {
                setError(`Vehicle with license plate '${formData.licensePlate}' already exists.`);
            } else {
                setError('An error occurred while creating the vehicle.');
            }
            console.error('Error creating vehicle:', err);
        }
    };
    
    

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    label="License Plate"
                                    name="licensePlate" // lowercase name to match state
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.licensePlate} // binding to lowercase state
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
            </Paper>
        </Box>
    );
};

export default CreateVehicleForm;
