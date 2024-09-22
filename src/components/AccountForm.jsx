import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAccountDetails } from '../store/apiFunctions';

const AccountForm = ({ mode, accountId }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        companyName: '',
        companyPhone: '',
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
                        password: '', // keep password empty for security, maybe update it to a bunch of dots instead
                        companyName: accountDetails.companyName || '',
                        companyPhone: accountDetails.companyPhone || '',
                        companyRole: accountDetails.role || '',
                    });
                } else {
                    console.log('No account details found.');
                }
            };
            fetchAccountData();
        }
    }, [mode, accountId]); // dependency array to rerun the effect if mode or accountId changes

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
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    required={!mode === 'edit'} // password is only required for creating a new account
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Name"
                                    name="companyName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Phone"
                                    name="companyPhone"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.companyPhone}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Role"
                                    name="companyRole"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.companyRole}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px" }}>
                                {mode === 'edit' ? 'Save Changes' : 'Create Account'}
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AccountForm;
