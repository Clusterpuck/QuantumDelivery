import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { getLocationDetails, updateLocation } from '../store/apiFunctions'; // Replace with actual API functions

const EditLocationForm = ({ locationId }) => {
    const [formData, setFormData] = useState({
        Longitude: '',
        Latitude: '',
        Address: '',
        Suburb: '',
        State: '',
        PostCode: '',
        Country: '',
        Description: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const locationData = await getLocationDetails(locationId); // Fetch location details
                if (locationData) {
                    setFormData({
                        Longitude: locationData.longitude || '',
                        Latitude: locationData.latitude || '',
                        Address: locationData.address || '',
                        Suburb: locationData.suburb || '',
                        State: locationData.state || '',
                        PostCode: locationData.postCode || '',
                        Country: locationData.country || '',
                        Description: locationData.description || '',
                    });
                } else {
                    setError('No location details found.');
                }
            } catch (error) {
                console.error(`Error fetching location details for ID: ${locationId}`, error);
                setError('Failed to load location data, no location found.');
            }
        };

        fetchLocationData();
    }, [locationId]);

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
            const result = await updateLocation(locationId, formData); // Update location in DB

            if (result) {
                setSuccess(true);
                if (!formData.Address || !formData.Suburb || !formData.Country) {
                    setError("Address, Suburb, and Country fields are required.");
                    return;
                }
                setSuccessMessage('Location updated successfully!');
                console.log('Location updated successfully:', result);
            } else {
                setError('Failed to update location.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating the location.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        Editing Location {locationId}
                    </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Longitude"
                                    name="Longitude"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Longitude}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Latitude"
                                    name="Latitude"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Latitude}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address"
                                    name="Address"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Address}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Suburb"
                                    name="Suburb"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Suburb}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State"
                                    name="State"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.State}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Post Code"
                                    name="PostCode"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.PostCode}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Country"
                                    name="Country"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Country}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Description"
                                    name="Description"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.Description}
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

export default EditLocationForm;
