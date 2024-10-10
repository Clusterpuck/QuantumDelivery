import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography, Autocomplete } from '@mui/material';
import { fetchCustomers, getLocationDetails, updateLocation } from '../store/apiFunctions'; 
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

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
        CustomerName: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [customers, setCustomers] = useState(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const locationData = await getLocationDetails(locationId); // Fetch location details
                loadCustomers(locationData.customerName);
                if (locationData) {
                    console.log("In use effect location data is " + JSON.stringify(locationData));
                    setFormData({
                        Longitude: locationData.longitude || '',
                        Latitude: locationData.latitude || '',
                        Address: locationData.address || '',
                        Suburb: locationData.suburb || '',
                        State: locationData.state || '',
                        PostCode: locationData.postCode || '',
                        Country: locationData.country || '',
                        Description: locationData.description || '',
                        CustomerName: locationData.customerName || '',
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

    
  const handleCustomerChange = (event, newValue) => {
  
    setSelectedCustomer(newValue);
     // Update formData with selected customer ID
     setFormData((prevData) => ({
        ...prevData,
        CustomerName: newValue ? newValue.name : ''
    }));
  };

  const loadCustomers = async (customerName) => {
    setLoadingCustomers(true);
    const newCustomers = await fetchCustomers();
    setCustomers(newCustomers);
       // Find the matching customer by CustomerID after customers are fetched
       if (customerName) {
        console.log("In load customers, form data customer ID is " + customerName);
        const matchedCustomer = newCustomers.find(customer => customer.name === customerName);
        setSelectedCustomer(matchedCustomer || null); // Set the matching customer
    }
    setLoadingCustomers(false);
  };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Saving changes...', JSON.stringify( formData ) ); 

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
                 <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <EditLocationAltIcon  />  
                    <Typography variant="h5" margin={1}>
                        Editing Location
                    </Typography>
                    <Typography variant='subheading'>
                        {locationId}
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
                            <Grid item xs={12} sm={12}>
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
        </Box>
    );
};

export default EditLocationForm;
