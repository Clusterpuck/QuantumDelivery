import React, { useEffect, useState } from 'react';
import { fetchAccounts, fetchVehicles, updateRouteDetails } from '../store/apiFunctions.js';
import '../index.css';
import {
    IconButton, Box, Button, Grid, Paper, Typography, Skeleton, TextField, Autocomplete, Popper
    } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const EditRouteForm = ({ route, onRefresh, onClose }) => {
    const [drivers, setDrivers] = useState(null);
    const [vehicles, setVehicles] = useState(null);

    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');

    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [loadingVehicles, setLoadingVehicles] = useState(false);

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const loadDrivers = async () => {
        setLoadingDrivers(true);
        const newAccounts = await fetchAccounts();
        const newDrivers = newAccounts.filter(account => account.role === 'DRIVER');
        setDrivers(newDrivers);
        setLoadingDrivers(false);
    };

    const loadVehicles = async () => {
        setLoadingVehicles(true);
        const newVehicles = await fetchVehicles();
        setVehicles(newVehicles);
        setLoadingVehicles(false);
    };

    const handleDriverChange = (newValue) => {
        setSelectedDriver(newValue);
    };

    const handleVehicleChange = (newValue) => {
        setSelectedVehicle(newValue);
    };

    const handleSaveChanges = async () => {
        const input = {
            routeID: route?.deliveryRouteID,
            driverUsername: selectedDriver?.username,
            vehicleID: selectedVehicle?.licensePlate,
        };
        
            console.log("SENDING FROM EDIT FORM: ", input);
            const responseMessage = await updateRouteDetails(input);
            setMessage(responseMessage);
            onRefresh();
            onClose();
            console.log("MESSAGE: ", message);

        };

    useEffect(() => {
        loadDrivers();
        loadVehicles();
    }, []);

    useEffect(() => {
        if (route) {
            setSelectedDriver(drivers?.find(driver => driver.username === route.driverUsername) || null);
            setSelectedVehicle(vehicles?.find(vehicle => vehicle.licensePlate === route.vehicleId) || null);
        }
    }, [route, drivers, vehicles]);

    const DriverAutocomplete = () => {
        if (loadingDrivers) {
            return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }

        if (drivers) {
            return (
                <Autocomplete
                    disablePortal
                    id="Drivers"
                    value={selectedDriver} // Find the matching customer object
                    options={drivers}
                    getOptionLabel={(option) => option.username}
                    getOptionKey={(option) => option.username}
                    fullWidth
                    onChange={(event, newValue) => handleDriverChange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select Driver" />}
                    
                />
            );
        }
    };

    const VehicleAutocomplete = () => {
        if (loadingVehicles) {
            return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }

        if (vehicles) {
            return (
                <Autocomplete
                    disablePortal
                    id="Vehicles"
                    value={selectedVehicle} // Find the matching customer object
                    options={vehicles}
                    getOptionLabel={(option) => option.licensePlate}
                    getOptionKey={(option) => option.licensePlate}
                    fullWidth
                    onChange={(event, newValue) => handleVehicleChange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select Vehicle" />}
                    
                />
            );
        }
    };

    const skeletonStyles = {
        width: '100%',  
        maxWidth: 800,
        height: 56
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, width: '500px', display: 'flex', flexDirection: 'column',height: 'auto',
            overflow: 'hidden' }}>
            <form style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <IconButton 
                color="primary"
                aria-label="cancel" 
                onClick={onClose}  // Handle cancel action
                sx={{ position: 'absolute', top: 8, right: 8}}  // Top-right positioning
            >
                <CancelIcon />
            </IconButton>
                {/* Title and Disabled Order ID */}
                <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Grid item>
                        <Typography variant="h5" component="h1">
                            Edit Route
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Route ID"
                            value={route?.deliveryRouteID || ''}
                            disabled
                            variant="outlined"
                            sx={{ width: '200px' }}
                        />
                    </Grid>
                </Grid>

                {/* Vehicle & Driver Fields */}
                <Grid container spacing={2} sx={{ mt: 1, flexGrow: 1 }}>
                    <Grid item xs={12} sm={12}>
                        <DriverAutocomplete />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <VehicleAutocomplete />
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <Grid container justifyContent="center" sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" sx={{ width: '200px' }} onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Grid>
                {message && (
                    <Box mt={2} p={2} sx={{ 
                        backgroundColor: 'var(--action-colour)',
                        color: '#ffffff',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}>
                        <Typography variant="body1">
                            {message}
                        </Typography>
                    </Box>
                )}
            </form>         
        </Paper>
    );
};
export default EditRouteForm;