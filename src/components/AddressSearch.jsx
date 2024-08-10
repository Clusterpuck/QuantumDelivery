import React, { useEffect, useState, useCallback } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {fetchRegion, postLocation} from '../store/apiFunctions';
import Grid from '@mui/material/Grid';


// This is a public token, so it's okay to expose it here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg';

const styleConstants = {
    fieldSpacing: { mb: 2 }
};


const AddressSearch = ({onCloseForm}) => {
    const [defaultCoordinates, setDefaultCoordinates] = useState([0, 0])
    const [minimapFeature, setMinimapFeature] = useState({
        type: 'Feature',
        geometry: {
            type: 'Point',
            //reset map to allow for pin movement reset
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

    
    //Handle for controlling map marker location here. 
    const handleAutofillRetrieve = (response) => {
        setMinimapFeature(response.features[0]);
    };


    //for submission to extract to first verify present data to then later make and post in send method
    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault();
        const result = await showConfirm();

        if (result.type === 'nochange') {
            const newAddress = new FormData(e.target);
            newAddress.append('latitude', minimapFeature.geometry.coordinates[0]);
            newAddress.append('longitude', minimapFeature.geometry.coordinates[1]);
            sendLocation(newAddress);
            for (const pair of newAddress.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
            handleResetMap();
            onCloseForm();
        }
    }, [showConfirm]);

    //creates the location object and send to the post api method
    const sendLocation = (formData) => {
        const newAddress = {
            //latitude added from map reference instead of object for safety. 
            longitude: minimapFeature.geometry.coordinates[0],
            latitude: minimapFeature.geometry.coordinates[1],
            address: formData.get('address-line1 address-search'),
            suburb: formData.get('suburb'),
            state: formData.get('state'),
            country: 'Australia', // Assuming this is a constant, otherwise capture from form
            description: formData.get('apartment') || 'No Description', // Default description if not provided
        };
        
        console.log("Sending location " + JSON.stringify(newAddress));

        postLocation(newAddress);

    }



    //refreshes for the map to recenter the map marker
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


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 900, width: '100%' }}>
            <Grid container spacing={2} >
                <Grid item xs={12} >
                    <h3>Delivery Address</h3>
                </Grid>

                <form ref={formRef} onSubmit={handleFormSubmit}>
                  

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
                                name="suburb"
                                variant='outlined'
                                autoComplete='address-level2'
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} sx={styleConstants.fieldSpacing}>
                            <TextField
                                label="State / Region"
                                name="state"
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
                        <Button onClick={handleResetMap} variant="contained" color="secondary">
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


            </Paper>
        </Box>
    );
};

export default AddressSearch;
