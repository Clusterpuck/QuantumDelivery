import React, { useState, useCallback } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import { createLocation } from '../store/apiFunctions'; 
import AddressSearch from './AddressSearch';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const CreateLocationForm = () => {
    const [formData, setFormData] = useState({
        locationName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [minimapFeature, setMinimapFeature] = useState({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0], // default coordinates
        },
        properties: {},
    });

    const { showConfirm } = useConfirmAddress({
        accessToken: MAPBOX_ACCESS_TOKEN,
    });

    // handle user input in the form fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    //extracts the final point location on the map to save to map
    const handleSaveMarkerLocation = (coordinate) => {
        setMinimapFeature({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinate,
            },
            properties: {},
        });
    };

    // handle the address autofill retrieval when a suggestion is selected
    const handleAutofillRetrieve = (response) => {
        const feature = response.features[0];
        setMinimapFeature(feature);

        // update fields based on the selected autofill suggestion
        setFormData((prev) => ({
            ...prev,
            address: feature.place_name || prev.address,
            city: feature.context?.find((c) => c.id.includes('place'))?.text || prev.city,
            state: feature.context?.find((c) => c.id.includes('region'))?.text || prev.state,
            zipCode: feature.context?.find((c) => c.id.includes('postcode'))?.text || prev.zipCode,
        }));
    };

    // handle the form submission
    const handleFormSubmit = useCallback(
        async (event) => {
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
                        alert('Location created successfully!');
                    } else {
                        alert('Failed to create location.');
                    }
                } catch (err) {
                    console.error('Error creating location:', err);
                }
            }
        },
        [formData, minimapFeature, showConfirm]
    );

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <form style={{ width: '80%' }} onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
                            <AddressSearch />
                            
                            {/* input field for location name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label=" Location Name"
                                    name="locationName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.locationName}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
                                    }}
                                />
                            </Grid>

                            {/* input field for address line 1 */}
                            <Grid item xs={12} sm={6}>
                                <AddressAutofill
                                    accessToken={MAPBOX_ACCESS_TOKEN}
                                    onRetrieve={handleAutofillRetrieve}
                                >
                                    <TextField
                                        id='address-line1'
                                        name='address-line1'
                                        variant="outlined"
                                        autoComplete="address-line1"
                                        fullWidth
                                        label=" Address"
                                        InputLabelProps={{
                                            style: { top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
                                        }}
                                    />
                                </AddressAutofill>
                            </Grid>
                            
                            {/* input field for address line 2 */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label=" Apartment, suite, etc."
                                    name="apartment"
                                    variant='outlined'
                                    autoComplete='address-line2'
                                    fullWidth
                                    InputLabelProps={{
                                        style: { top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
                                    }}
                                />
                            </Grid>

                            {/* input field for city */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label=" City"
                                    name="city"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
                                    }}
                                />
                            </Grid>

                            {/* input field for state */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label=" State"
                                    name="state"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
                                    }}
                                />
                            </Grid>

                            {/* input field for zip code */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label=" Zip Code"
                                    name="zipCode"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        style: { top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' } 
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* map box*/}
                        <Box sx={{ height: 180, width: '100%', position: 'relative', mt: 2, mb: 5 }}>
                            <AddressMinimap
                                feature={minimapFeature}
                                show={!!minimapFeature}
                                satelliteToggle
                                canAdjustMarker
                                onSaveMarkerLocation={handleSaveMarkerLocation}
                                accessToken={MAPBOX_ACCESS_TOKEN}
                                footer
                                keepMarkerCentered={false}
                            />
                        </Box>

                        <Grid item xs={12} sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: '250px', mb: 2 }}>
                                Create Location
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default CreateLocationForm;
