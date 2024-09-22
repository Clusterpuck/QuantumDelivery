import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAccountDetails, createAccount } from '../store/apiFunctions'; // Ensure you import createAccount

const AccountForm = ({ mode, accountId }) => {
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

    useEffect(() => {
        if (mode === 'edit') {
            const fetchAccountData = async () => {
                const accountDetails = await getAccountDetails(accountId);
                console.log('editing, for username: ' + accountId);
                if (accountDetails) {
                    setFormData({
                        fullName: accountDetails.name || '',
                        email: accountDetails.username || '',
                        password: '', // password empty for security, is displayed as dots
                        address: accountDetails.address || '',
                        phone: accountDetails.phone || '',
                        companyRole: accountDetails.role || '',
                    });
                } else {
                    console.log('No account details found.');
                }
            };
            fetchAccountData();
        }
    }, [mode, accountId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (mode === 'edit') {
            console.log('Saving changes...', formData);
            // TODO: Add update logic here for editing account
        } else {
            try {
                const result = await createAccount(formData);
                if (result) {
                    setSuccess(true);
                    console.log('Account created successfully:', result);
                } else {
                    setError('Failed to create account.');
                }
            } catch (err) {
                setError('An error occurred while creating the account.');
                console.error(err);
            }
        }
    };

    const handleChangePassword = () => {
        console.log('Change password logic goes here');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                        <AccountCircleIcon sx={{ fontSize: 80, mb: 2, alignItems: 'center' }} />
                    </Grid>
                    <form style={{ width: '80%', alignItems: 'center' }} onSubmit={handleSubmit}>
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
                                {mode === 'edit' ? (
                                    <TextField
                                        label="Password"
                                        name="password"
                                        type="password"
                                        variant="outlined"
                                        fullWidth
                                        value={'******'}
                                        disabled
                                    />
                                ) : (
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
                                )}
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
                                {mode === 'edit' ? 'Save Changes' : 'Create Account'}
                            </Button>
                            {mode === 'edit' && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleChangePassword}
                                    sx={{
                                        padding: '10px 20px',
                                        fontSize: '1rem',
                                        border: '2px solid',
                                        borderColor: 'secondary.main',
                                        '&:hover': {
                                            backgroundColor: 'secondary.main',
                                            color: 'white',
                                        },
                                    }}
                                >
                                    Change Password
                                </Button>
                            )}
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">Account created successfully!</Typography>}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AccountForm;
