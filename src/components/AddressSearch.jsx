import React, { useEffect, useState, useCallback } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {fetchRegion} from '../store/apiFunctions';
import Grid from '@mui/material/Grid';

// This is a public token, so it's okay to expose it here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const styleConstants = {
    fieldSpacing: { mb: 2 }
};


const MapboxExample = () => {
    const [addresses, setAddresses] = useState([]);
    const [defaultCoordinates, setDefaultCoordinates] = useState([0, 0])
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
                console.log( "Setting default coordinates " + region.longitude)
                setDefaultCoordinates( [region.longitude, region.latitude] );
                handleResetMap();
                
            };
        };

        loadLocation();
    }, []);

    const removeLocation = (index) => {
        setAddresses(prevAddresses => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses.splice(index, 1);
            return updatedAddresses;
        });
    };


    const handleAutofillRetrieve = (response) => {
        setMinimapFeature(response.features[0]);
    };

    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault();
        const result = await showConfirm();

        if (result.type === 'nochange') {
            const newAddress = new FormData(e.target);
            for (const pair of newAddress.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
            newAddress.append('latitude', minimapFeature.geometry.coordinates[0]);
            newAddress.append('longitude', minimapFeature.geometry.coordinates[1]);
            setAddresses(prevAddresses => [...prevAddresses, newAddress]);
            handleResetMap();
        }
    }, [showConfirm]);


    const handleTryAgain = () => {
        handleResetMap();
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
        setMapKey(prevKey => prevKey + 1); // Force re-render of AddressMinimap
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

    const renderAddress = (formData) => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                    Customer: {formData.get('customerName')}
                </Grid>
                <Grid item xs={8}>
                    <div><strong>Address:</strong></div>
                    <div>{formData.get('address-line1 address-search')}</div>
                    {/*Frustratingly the name is set to automatically be appended with
                    address search at the end */}
                    {formData.get('address-line2') && <div>{formData.get('address-line2')}</div>}
                    <div>
                        {formData.get('address-level2')}, {formData.get('address-level1')} {formData.get('postal-code')}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div><strong>Latitude:</strong> {formData.get('latitude')}</div>
                    <div><strong>Longitude:</strong> {formData.get('longitude')}</div>
                </Grid>
            </Grid>
        );
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 900, width: '100%' }}>
            <Grid container spacing={2} >
                <Grid item xs={12} >
                    <h3>Delivery Address</h3>
                </Grid>

                <form ref={formRef} onSubmit={handleFormSubmit}>
                    <Grid item xs={12} sx={styleConstants.fieldSpacing}>
                        <TextField
                            name="customerName"
                            label="Customer Name"
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sx={styleConstants.fieldSpacing}>
                        <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={handleAutofillRetrieve}>
                            <TextField
                                id='address-line1'
                                name='address-line1'
                                variant="outlined"
                                autoComplete="address-line1"
                                fullWidth
                                label="Address"
                            />
                        </AddressAutofill>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3} sx={styleConstants.fieldSpacing}>
                            <TextField
                                label="Apartment, suite, etc. (optional)"
                                name="apartment"
                                variant='outlined'
                                autoComplete='address-line2'
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} sx={styleConstants.fieldSpacing}>
                            <TextField
                                label="City"
                                name="address-level2"
                                variant='outlined'
                                autoComplete='address-level2'
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} sx={styleConstants.fieldSpacing}>
                            <TextField
                                label="State / Region"
                                name="address-level1"
                                variant='outlined'
                                autoComplete='address-level1'
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} sx={styleConstants.fieldSpacing}>
                            <TextField
                                label="ZIP / Postcode"
                                name="postal-code"
                                variant='outlined'
                                autoComplete='postal-code'
                                required
                                fullWidth
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
                            keepMarkerCentered={false} // Keep this false to allow marker adjustments
                        />
                    </Box>

                    <Grid container spacing={1}>
                    <Grid item xs={6} justifyContent={'flex-end'} >
                        <Button onClick={handleTryAgain} variant="contained" color="secondary">
                            Clear Form
                        </Button>
                    </Grid>

                    <Grid item xs={6} justifyContent={'flex-end'} >
                        <Button type="submit" variant="contained" color="primary">
                            Add Location
                        </Button>
                    </Grid>
                    </Grid>
                </form>
            </Grid>


                <Box sx={{ display: addresses.length === 0 ? 'none' : 'block' }}>
                    {addresses.map((address, index) => (
                        <Box key={index} sx={{ borderRadius: 1, border: 1, borderColor: 'grey.300', px: 2, py: 1, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={8} id="shipping-address">
                                {renderAddress(address)}
                            </Grid>
                            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Button onClick={() => removeLocation(index)} variant="contained" color="secondary">
                                    Remove
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    
                    ))}

                   
                </Box>
            </Paper>
        </Box>
    );
};

export default MapboxExample;
