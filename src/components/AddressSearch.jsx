import React, { useEffect, useState, useCallback } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import { TextField, Box, Paper, Button, Grid, Typography, Autocomplete } from '@mui/material';
import { createLocation, fetchRegion } from '../store/apiFunctions';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import { Description } from '@mui/icons-material';
import { fetchCustomers, fetchLocations, postMethod } from '../store/apiFunctions.js';

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
        country: '',
        apartment: '',
    });

    const [mapKey, setMapKey] = useState(0);
    const { formRef, showConfirm } = useConfirmAddress({
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [customers, setCustomers] = useState(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Load initial location data
    useEffect(() => {
        const loadLocation = async () => {
            const region = await fetchRegion();
            if (region && region.latitude && region.longitude) {
                setDefaultCoordinates([region.longitude, region.latitude]);
                handleResetMap();
            }
        };
        loadLocation();
        loadCustomers();
    }, []);

    // Adjust Mapbox suggestion dropdown's z-index
    useEffect(() => {
        const adjustMapboxZIndex = () => {
            const results = document.querySelectorAll('[class^="mbx"][class$="--Results"]');
            results.forEach((result) => {
                result.style.zIndex = '3000';
            });
        };

        adjustMapboxZIndex();
        const observer = new MutationObserver(() => {
            adjustMapboxZIndex();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    const handleAutofillRetrieve = (response) => {
        const feature = response.features[0];
        console.log("Autofill Feature: ", feature);  // debug the feature returned by Mapbox
    
        setMinimapFeature(feature);
    
        const placeName = feature.properties?.place_name || ''; 
        
        const cityContext = feature.context?.find(context => context.id.includes('place'));
        const suburbContext = feature.context?.find(context => context.id.includes('locality') || context.id.includes('neighborhood'));
        const stateContext = feature.context?.find(context => context.id.includes('region'));
        const zipCodeContext = feature.context?.find(context => context.id.includes('postcode'));
        const countryContext = feature.context?.find(context => context.id.includes('country'));
    
        const addressParts = placeName.split(',');
        const streetAddress = addressParts[0]?.trim() || '';
        const country = addressParts[addressParts.length - 1]?.trim() || ''; 
        const zipCode = zipCodeContext ? zipCodeContext.text : ''; // extracting postcode
    
        console.log("Constructed Address: ", streetAddress, "Country: ", country);  
    
        setFormData((prevData) => ({
            ...prevData,
            address: streetAddress, 
            city: cityContext ? cityContext.text : '',
            suburb: suburbContext ? suburbContext.text : '',  // setting the suburb
            state: stateContext ? stateContext.text : '',
            zipCode: zipCode,  // set zipCode from context
            country: country, // set country from the last part of place_name
            customerID: selectedCustomer ? selectedCustomer.id : 0
        }));
    };

    // Handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log('Creating location...', formData);
        const result = await showConfirm();

        try {
            const locationData = {
                Latitude: minimapFeature.geometry.coordinates[1],
                Longitude: minimapFeature.geometry.coordinates[0],
                Address: formData.address,
                Suburb: formData.city,
                State: formData.state,
                Postcode: formData.zipCode,
                Country: formData.country,
                Description: formData.locationName,
                customerID: selectedCustomer ? selectedCustomer.id : 0
            };

            console.log("locationData:", locationData); // Debug the location data

            const createResult = await createLocation(locationData);
            if (createResult) {
                setSuccess(true);
                setSuccessMessage('Location created successfully!');
                setError(null); 
                console.log('Location created successfully:', createResult);
                handleResetMap();
            } else {
                setError('Failed to create location.');
            }
        } catch (err) {
            setError('An error occurred while creating the location.');
            console.error(err);
        }
    };

    
  const handleCustomerChange = (event, newValue) => {
  
    setSelectedCustomer(newValue);
  };

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    const newCustomers = await fetchCustomers();
    setCustomers(newCustomers);
    setLoadingCustomers(false);
  };


    // Handle reset map
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

    // Handle save marker location
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
                    <LocationOnIcon sx={{ fontSize: 50, mb: 1 }} />  
                    <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                        Create a New Location
                    </Typography>
                    <form ref={formRef} onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    id="address-name"
                                    name="address-name"
                                    label="Address Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    tabIndex={2}
                                    disablePortal={false}
                                    id="Customers"
                                    options={customers || []}
                                    loading={loadingCustomers}
                                    getOptionLabel={(option) => `${option.name} ${option.phone}`}
                                    value={selectedCustomer}
                                    onChange={handleCustomerChange}
                                    renderInput={(params) => (
                                        <TextField {...params} required label="Select Customer" />
                                    )}
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
                                    autoComplete='address-line2'
                                    fullWidth
                                    onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    name="suburb"
                                    variant="outlined"
                                    autoComplete='address-level2'
                                    fullWidth
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="State / Region"
                                    name="state"
                                    variant="outlined"
                                    autoComplete='address-level1'
                                    fullWidth
                                    required
                                    value={formData.state}
                                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ZIP / Postcode"
                                    name="postal-code"
                                    variant="outlined"
                                    autoComplete='postal-code'
                                    fullWidth
                                    required
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
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
