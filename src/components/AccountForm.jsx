import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAccountDetails } from '../store/apiFunctions';

const AccountForm = ({ mode, accountId }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        companyRole: '',
    });

    useEffect(() => {
        if (mode === 'edit') {
            const fetchAccountData = async () => {
                const accountDetails = await getAccountDetails(accountId);
                console.log('editing, for username: ' + accountId);
                if (accountDetails) {
                    setFormData({
                        fullName: accountDetails.name || '',
                        email: accountDetails.username || '',
                        password: '', // password empty for security, shown as dots in input
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

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: handle form submit event (update db with new details)
        if (mode === 'edit') {
            console.log('Saving changes...', formData);
        } else {
            console.log('Creating new account...', formData);
        }
    };

    const handleChangePassword = () => {
        // TODO: Implement change password logic here
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
                                        padding: '10px 20px', // Increase padding
                                        fontSize: '1rem', // Increase font size
                                        border: '2px solid', // Make border thicker
                                        borderColor: 'secondary.main',
                                        '&:hover': {
                                            backgroundColor: 'secondary.main', // Change background on hover
                                            color: 'white', // Change text color on hover
                                        },
                                    }}
                                >
                                    Change Password
                                </Button>
                            )}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AccountForm;
