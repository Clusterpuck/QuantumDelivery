import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { postCustomer } from '../store/apiFunctions';

const AddCustomer = ( {onCloseForm} ) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePhoneChange = (e) => {
        const phoneValue = e.target.value;
        if (/^\d*$/.test(phoneValue)) {
            setPhone(phoneValue);
            setError('');
        } else {
            setError('Phone number must be numeric');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!name || !phone) {
            setError('All fields are required');
            return;
        }

        const newCustomer = {
            id: 0,  // Assuming the backend will handle ID generation
            name: name,
            phone: phone,
        };

        try {
            await postCustomer(newCustomer);
            setSnackbarMessage('Customer added successfully!');
            setSnackbarSeverity('success');
            setName('');
            setPhone('');
            onCloseForm();
        } catch (error) {
            setSnackbarMessage('Failed to add customer ' + error);
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, width: '100%' }}>
                <h3>Add Customer</h3>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={handleNameChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                variant="outlined"
                                fullWidth
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                                error={!!error}
                                helperText={error}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Add Customer
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddCustomer;
