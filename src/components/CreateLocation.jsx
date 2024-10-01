import React, { useState } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';
import LocationOnIcon from '@mui/icons-material/LocationOn';  // Importing the LocationOn icon
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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
        <AddressSearch />
    );
};

export default CreateLocationForm;
