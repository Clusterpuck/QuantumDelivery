import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from 'js-cookie'; 
import { getAccountDetails, editAccount } from '../store/apiFunctions'; 

const AccountDetailsForm = ({ handleOpenPasswordModal }) => {
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
    const [successMessage, setSuccessMessage] = useState('');

    // get username from cookie (id) and authToken
    const accountId = Cookies.get('userName');

    useEffect(() => {
        const fetchAccountData = async () => {
            if (accountId) {
                try {
                    const accountDetails = await getAccountDetails(accountId);
                    if (accountDetails) {
                        setFormData({
                            fullName: accountDetails.name || '',
                            email: accountDetails.username || '',
                            password: '', // Password empty for security
                            address: accountDetails.address || '',
                            phone: accountDetails.phone || '',
                            companyRole: accountDetails.role || '',
                        });
                    } else {
                        setError('No account details found.');
                    }
                } catch (err) {
                    setError('Failed to fetch account details.');
                    console.error(err);
                }
            } else {
                setError('No account ID found.');
            }
        };
        fetchAccountData();
    }, [accountId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        
        const accountDetails = await getAccountDetails(accountId);

        // Prepare the updated account data to send to the backend
        const updatedAccountData = {
            Username: formData.email,       // Email corresponds to Username on the backend
            Name: formData.fullName,        // fullName corresponds to Name
            Phone: formData.phone,          // Phone field
            Password: accountDetails.password,    // Password if changed
            Role: formData.companyRole,      // Role corresponds to companyRole
            Address: formData.address      // Address field
        };

        // Ensure email is in valid format
        if (!/\S+@\S+\.\S+/.test(updatedAccountData.Username)) {
            setError('Email format is invalid.');
            return;
        }

        try {
            const result = await editAccount(accountId, updatedAccountData);
            if (result) {
                setSuccess(true);
                setSuccessMessage('Account updated successfully!');
            } else {
                setError('Failed to update account.');
            }
        } catch (err) {
            setError('An error occurred while updating the account.');
            console.error(err);
        }
    };

    const handleChangePassword = () => {
        handleOpenPasswordModal(accountId); // pass the username to the modal handler
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                        <AccountCircleIcon sx={{ fontSize: 80, mb: 2, alignItems: 'center' }}/>
                    </Grid>
                    <Grid item>
                        {/* Form Starts Here */}
                    </Grid>
                    <form style={{ width: '80%', alignItems: 'center' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={18} sm={6}>
                                <TextField 
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Company Role</InputLabel>
                                    <Select
                                        name="companyRole"
                                        value={formData.companyRole}
                                        onChange={handleInputChange}
                                        disabled={formData.companyRole === 'DRIVER'} // Disable if the role is "Driver"
                                    >
                                        <MenuItem value="DRIVER" sx={{ textAlign: 'left' }}>Driver</MenuItem>
                                        <MenuItem value="ADMIN" sx={{ textAlign: 'left' }}>Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px" }}>
                                Save Changes
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AccountDetailsForm;
