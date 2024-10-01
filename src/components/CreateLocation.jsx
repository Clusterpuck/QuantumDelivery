import React, { useState } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';  // Importing the LocationOn icon
import { createLocation } from '../store/apiFunctions'; 
import AddressSearch from './AddressSearch';

const CreateLocationForm = () => {
    const [formData, setFormData] = useState({
        locationName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
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
        console.log('Creating location...', formData);

        try {
            const result = await createLocation({
                Name: formData.locationName,
                Address: formData.address,
                City: formData.city,
                State: formData.state,
                ZipCode: formData.zipCode,
            });

            if (result) {
                setSuccess(true);
                setSuccessMessage('Location created successfully!');
                setError(null); 
                console.log('Location created successfully:', result);
            } else {
                setError('Failed to create location.');
            }
        } catch (err) {
            setError('An error occurred while creating the location.');
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    
                    {/* Icon at the top */}
                    <LocationOnIcon sx={{ fontSize: 50, mb: 1}} />  
                    
                    {/* Title of the form */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 1}}>
                        Create a New Location
                    </Typography>
                    
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Location Name"
                                    name="locationName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.locationName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    name="city"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State"
                                    name="state"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.state}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Zip Code"
                                    name="zipCode"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Create Location
                            </Button>
                            <Button type="button" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }} onClick={() => setFormData({ locationName: '', address: '', city: '', state: '', zipCode: '' })}>
                                Clear Form
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

export default CreateLocationForm;
