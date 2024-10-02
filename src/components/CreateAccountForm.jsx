import React, { useState } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createAccount } from '../store/apiFunctions';

const CreateAccountForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        companyRole: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the data to be sent to the backend
        const newAccountData = {
            Username: formData.email,       // Email corresponds to Username on the backend
            Name: formData.fullName,        // fullName corresponds to Name
            Password: formData.password,    // Password field
            Phone: formData.phone,          // Phone field
            Address: formData.address,      // Address field
            Role: formData.companyRole      // Role corresponds to companyRole
        };

        try {
            const result = await createAccount(newAccountData);
            if (result) {
                setSuccess(true);
                setError(null);
                console.log('User created successfully:', result);
            } else {
                setError('Failed to create user.');
            }
        } catch (err) {
            setError('An error occurred while creating the user.');
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                        <AccountCircleIcon sx={{ fontSize: 80, mb: 2 }} />
                    </Grid>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Full Name"
                                    name="fullName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Company Role</InputLabel>
                                    <Select
                                        name="companyRole"
                                        value={formData.companyRole}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="DRIVER">Driver</MenuItem>
                                        <MenuItem value="ADMIN">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Create Account
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">User created successfully!</Typography>}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default CreateAccountForm;
