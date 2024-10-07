import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { getVehicle, updateVehicle } from '../store/apiFunctions'; 

const EditVehicleForm = ({ vehicleId }) => {
    const [formData, setFormData] = useState({
        LicensePlate: '',
        UnitOfMeasure: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                const vehicleData = await getVehicle(vehicleId); 
                if (vehicleData) {
                    setFormData({
                        LicensePlate: vehicleData.licensePlate || '',
                    });
                } else {
                    setError('No vehicle details found.');
                }
            } catch (error) {
                console.error(`Error fetching vehicle details for ID: ${vehicleId}`, error);
                setError('Failed to load vehicle data, no vehicle found.');
            }
        };

        fetchVehicleData();
    }, [vehicleId]);

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
            const result = await updateVehicle(vehicleId, formData); 

            if (result) {
                setSuccess(true);
                if (!formData.LicensePlate) {
                    setError("Both fields are required.");
                    return;
                }
                setSuccessMessage('Vehicle updated successfully!');
                console.log('Vehicle updated successfully:', result);
            } else {
                setError('Failed to update vehicle.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating the vehicle.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        Editing Vehicle {vehicleId}
                    </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} sx={{ display: 'flex', flexDirection: 'column', allignItems: 'center' }}>
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

export default EditVehicleForm;
