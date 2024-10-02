import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAccountDetails, reactivateAccount, editAccount } from '../store/apiFunctions'; 

const EditAccountForm = ({ accountId, handleOpenPasswordModal, accountStatus }) => {
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

    useEffect(() => {
        const fetchAccountData = async () => {
            const accountDetails = await getAccountDetails(accountId);
            if (accountDetails) {
                setFormData({
                    fullName: accountDetails.name || '',
                    email: accountDetails.username || '',
                    password: '', // password empty for security
                    address: accountDetails.address || '',
                    phone: accountDetails.phone || '',
                    companyRole: accountDetails.role || '',
                });
            } else {
                setError('No user details found.');
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
        
        // Log to check if id is a valid email
        console.log('Account ID:', accountId);
    
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
    
        // Log the updated account data
        console.log('Updated User Data:', updatedAccountData);
    
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
        handleOpenPasswordModal(formData.email); // Pass the username to the modal handler
    };

    const handleReactivate = async () => {
        try {
            await reactivateAccount(accountId); // Call the API function to reactivate the account
            setSuccess(true); 
            setSuccessMessage("User is now active!"); 
            setError(null); 
            const updatedDetails = await getAccountDetails(accountId); // Fetch updated details after reactivation
            if (updatedDetails) {
                setFormData({
                    fullName: updatedDetails.name || '',
                    email: updatedDetails.username || '',
                    password: '', // password empty for security
                    address: updatedDetails.address || '',
                    phone: updatedDetails.phone || '',
                    companyRole: updatedDetails.role || '',
                });
            }
        } catch (err) {
            setError('Failed to reactivate the user.'); 
        }
    };

    if (accountStatus === 'Inactive') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%', textAlign: 'center' }}>
                    <Typography variant="h6">
                        User cannot be edited as the account is inactive.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleReactivate} 
                        sx={{ mt: 2 }}
                    >
                        Re-activate
                    </Button>
                </Paper>
            </Box>
        );
    }

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
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    value={'******'} // Masked password display
                                    disabled
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
                                Save Changes
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleChangePassword}
                                sx={{ width: "250px", mb: 2 }}
                            >
                                Change Password
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">{successMessage}</Typography>}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default EditAccountForm;
