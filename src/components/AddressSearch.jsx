import React, { useEffect, useState, useCallback } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { fetchRegion, postLocation } from '../store/apiFunctions';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const AddressSearch = ({ onCloseForm }) => {
    const [defaultCoordinates, setDefaultCoordinates] = useState([0, 0]);
    const [minimapFeature, setMinimapFeature] = useState({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: defaultCoordinates,
        },
        properties: {},
    });
    const [mapKey, setMapKey] = useState(0);
    const { formRef, showConfirm } = useConfirmAddress({
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    useEffect(() => {
        const loadLocation = async () => {
            const region = await fetchRegion();
            if (region && region.latitude && region.longitude) {
                setDefaultCoordinates([region.longitude, region.latitude]);
                handleResetMap();
            }
        };
        loadLocation();
    }, []);

    const handleAutofillRetrieve = (response) => {
        setMinimapFeature(response.features[0]);
    };

    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault();
        const result = await showConfirm();

        if (result.type === 'nochange') {
            const newAddress = new FormData(e.target);
            newAddress.append('latitude', minimapFeature.geometry.coordinates[0]);
            newAddress.append('longitude', minimapFeature.geometry.coordinates[1]);
            sendLocation(newAddress);
            handleResetMap();
            onCloseForm();
        }
    }, [showConfirm]);

    const sendLocation = (formData) => {
        const newAddress = {
            addressName: formData.get('address-name'),
            longitude: minimapFeature.geometry.coordinates[0],
            latitude: minimapFeature.geometry.coordinates[1],
            address: formData.get('address-line1'),
            suburb: formData.get('suburb'),
            state: formData.get('state'),
            country: 'Australia',
            description: formData.get('apartment') || 'No Description',
        };
        postLocation(newAddress);
    };

    const handleResetMap = () => {
        setMinimapFeature({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: defaultCoordinates,
            },
            properties: {},
        });
        formRef.current.reset();
        setMapKey(prevKey => prevKey + 1);
    };

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

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 900, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        Add Delivery Address
                    </Typography>
                    <form ref={formRef} onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    id="address-name"
                                    name="address-name"
                                    label="Address Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={handleAutofillRetrieve}>
                                    <TextField
                                        id="address-line1"
                                        name="address-line1"
                                        label="Address"
                                        variant="outlined"
                                        autoComplete="address-line1"
                                        fullWidth
                                        required
                                    />
                                </AddressAutofill>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Apartment, suite, etc. (optional)"
                                    name="apartment"
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Suburb"
                                    name="suburb"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State / Region"
                                    name="state"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ZIP / Postcode"
                                    name="postal-code"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ height: 180, width: '100%', position: 'relative', mt: 2, mb: 5 }}>
                            <AddressMinimap
                                key={mapKey}
                                feature={minimapFeature}
                                show={!!minimapFeature}
                                satelliteToggle
                                canAdjustMarker
                                onSaveMarkerLocation={handleSaveMarkerLocation}
                                footer
                                accessToken={MAPBOX_ACCESS_TOKEN}
                                keepMarkerCentered={false}
                            />
                        </Box>

                        <Grid container justifyContent="space-between" spacing={2}>
                            <Grid item>
                                <Button onClick={handleResetMap} variant="contained" color="secondary">
                                    Clear Form
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary">
                                    Add Location
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AddressSearch;
