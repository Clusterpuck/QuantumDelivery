import React, { useEffect, useState, useCallback } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { createLocation, fetchRegion, postLocation } from '../store/apiFunctions';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 

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

    const [formData, setFormData] = useState({
        locationName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [mapKey, setMapKey] = useState(0);
    const { formRef, showConfirm } = useConfirmAddress({
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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

    // Use effect to adjust Mapbox suggestion dropdown's z-index
    useEffect(() => {
        const adjustMapboxZIndex = () => {
            const results = document.querySelectorAll('[class^="mbx"][class$="--Results"]');
            results.forEach((result) => {
                result.style.zIndex = '3000';
            });
        };

        // Adjust z-index when the component mounts
        adjustMapboxZIndex();

        // Add a mutation observer to watch for dynamic changes
        const observer = new MutationObserver(() => {
            adjustMapboxZIndex();
        });

        // Watch for changes in the body element
        observer.observe(document.body, { childList: true, subtree: true });

        // Cleanup observer when component unmounts
        return () => observer.disconnect();
    }, []);

    const handleAutofillRetrieve = (response) => {
        setMinimapFeature(response.features[0]);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log('Creating location...', formData);
        const result = await showConfirm();

        try
        {
            const result = await createLocation({
                Latitude: minimapFeature.geometry.coordinates[0],
                Longitude: minimapFeature.geometry.coordinates[1],
                Address: formData.get('address-line1'),
                City: formData.get('city'),
                State: formData.get('state'),
                ZipCode: formData.get('postal-code'),
            });
            if (result) {
                setSuccess(true);
                setSuccessMessage('Location created successfully!');
                setError(null); 
                console.log('Location created successfully:', result);
                handleResetMap();
            } else {
                setError('Failed to create location.');
            }
        } catch (err) {
            setError('An error occurred while creating the location.');
            console.error(err);
        }
    };

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
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">

                    {/* Icon at the top */}
                    <LocationOnIcon sx={{ fontSize: 50, mb: 1}} />  
                    
                    {/* Title of the form */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 1}}>
                        Create a New Location
                    </Typography>
                    <form ref={formRef} onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    id="address-name"
                                    name="address-name"
                                    label="Address Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid className="mapbox-container" item xs={12}>
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
                                    label="City"
                                    name="city"
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

                        <Box className="mapbox-container" sx={{ height: 180, width: '100%', position: 'relative', mt: 2, mb: 5 }}>
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
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button onClick={handleResetMap} variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                    Clear Form
                                </Button>
                                <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                    Add Location
                                </Button>
                                {error && <Typography color="error">{error}</Typography>}
                                {success && <Typography color="green">{successMessage}</Typography>}
                            </Grid>
                        </Grid>
                    </form>
                    
                </Grid>
            </Paper>
        </Box>
    );
};

export default AddressSearch;
