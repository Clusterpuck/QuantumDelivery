import React, { useState, useEffect } from 'react';
import { TextField, Box, CircularProgress, Button, Grid, Typography } from '@mui/material';
import { getVehicle, updateVehicle } from '../store/apiFunctions'; 

const EditVehicleForm = ({ vehicleId, onClose }) => {
    const [formData, setFormData] = useState({
        licensePlate: '', // Use lowercase 'licensePlate'
        make: '', // Use lowercase 'make'
        model: '', // Use lowercase 'model'
        colour: '', // Use lowercase 'colour'
        capacity: 0, // Use lowercase 'capacity'
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                const vehicleData = await getVehicle(vehicleId); 
                if (vehicleData) {
                    setFormData({
                        licensePlate: vehicleData.licensePlate || '', // Use lowercase
                        make: vehicleData.make || '', // Use lowercase
                        model: vehicleData.model || '', // Use lowercase
                        colour: vehicleData.colour || '', // Use lowercase
                        capacity: vehicleData.capacity || 0, // Use lowercase
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
        setLoadingSubmit(true);
        event.preventDefault();
        console.log('Saving changes...', formData);

        try {
            const result = await updateVehicle(vehicleId, formData);

            if (result && result.message) {
                setSuccess(true);
                setSuccessMessage(result.message);
                onClose(); 
            } else {
                setError('Failed to update vehicle.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating the vehicle.');
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <Typography variant="h5" gutterBottom>
                    Editing Vehicle {vehicleId}
                </Typography>
                <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="License Plate"
                                name="licensePlate" // Use lowercase name
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.licensePlate} // Use lowercase
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Make"
                                name="make" // Use lowercase name
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.make} // Use lowercase
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Model"
                                name="model" // Use lowercase name
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.model} // Use lowercase
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Colour"
                                name="colour" // Use lowercase name
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.colour} // Use lowercase
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Capacity"
                                name="capacity" // Use lowercase name
                                type="number"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.capacity} // Use lowercase
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                            {loadingSubmit ? <CircularProgress color="secondary" size={24} /> : "Save Changes"}
                        </Button>
                        {error && <Typography color="error">{error}</Typography>}
                        {success && <Typography color="green">{successMessage}</Typography>}
                    </Grid>
                </form>
            </Grid>
        </Box>
    );
};

export default EditVehicleForm;
