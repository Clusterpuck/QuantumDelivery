import React, { useState, useCallback } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import { createLocation } from '../store/apiFunctions';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

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
    const [minimapFeature, setMinimapFeature] = useState({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0],
        },
        properties: {},
    });

    const { formRef, showConfirm } = useConfirmAddress({
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAutofillRetrieve = (response) => {
        const feature = response.features[0];
        setMinimapFeature(feature);

        // only update these fields when an autofill selection is made 
        setFormData((prev) => ({
            ...prev,
            address: feature.place_name || prev.address,
            city: feature.context?.find(c => c.id.includes('place'))?.text || prev.city,
            state: feature.context?.find(c => c.id.includes('region'))?.text || prev.state,
            zipCode: feature.context?.find(c => c.id.includes('postcode'))?.text || prev.zipCode,
        }));
    };

    const handleFormSubmit = useCallback(async (event) => {
        event.preventDefault();
        const result = await showConfirm();
        
        if (result.type === 'nochange') {
            try {
                const newLocation = {
                    Name: formData.locationName,
                    Address: formData.address,
                    City: formData.city,
                    State: formData.state,
                    ZipCode: formData.zipCode,
                    Longitude: minimapFeature.geometry.coordinates[0],
                    Latitude: minimapFeature.geometry.coordinates[1],
                };

                console.log('Creating location...', newLocation);

                const result = await createLocation(newLocation);

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
        }
    }, [formData, minimapFeature, showConfirm]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <form ref={formRef} style={{ width: '80%' }} onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
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
                                <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={handleAutofillRetrieve}>
                                    <TextField
                                        label="Address"
                                        name="address"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}  
                                        autoComplete="address-line1"
                                    />
                                </AddressAutofill>
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

                        <Box sx={{ height: 180, width: '100%', position: 'relative', mt: 2, mb: 5 }}>
                            <AddressMinimap
                                feature={minimapFeature}
                                show={!!minimapFeature}
                                satelliteToggle
                                canAdjustMarker
                                accessToken={MAPBOX_ACCESS_TOKEN}
                                footer
                            />
                        </Box>

                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Create Location
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
