import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, FormControl, InputLabel, Select, MenuItem, Modal, Typography, Snackbar, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Cookies from 'js-cookie'; 
import { getAccountDetails, editAccount } from '../store/apiFunctions'; 
import CheckPasswordForm from './CheckPasswordForm';

const AccountDetailsForm = () => {
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
    const [openPasswordModal, setOpenPasswordModal] = useState(false); 
    const [editRole, setEditRole] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleShowMessage = (msg, type) => {
        setSnackbar({
            open: true,
            message: msg,
            severity: type
        });
    };

    const handleSnackbarClose = () =>
    {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

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

                        if (accountDetails.role === 'ADMIN') {
                            setEditRole(true);
                        } else {
                            setEditRole(false);
                        }
                    } else {
                        setError('No account details found.');
                        handleShowMessage('No account details found.', 'error');
                    }
                } catch (err) {
                    setError('Failed to fetch account details.');
                    handleShowMessage('Failed to fetch account details.', 'error');
                    console.error(err);
                }
            } else {
                setError('No account ID found.');
                handleShowMessage('No account ID found.', 'error');
            }
        };
        fetchAccountData();
    }, [accountId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'phone') {
            // Validate the value against the regex
            if (!/^(?:(?:\+61|0)4\d{2} ?\d{3} ?\d{3}|(?:\+61|0)(2|3|7|8)\d{8}|(?:\+61|0)1800 ?\d{3} ?\d{3}|(?:\+61|0)13\d{6}|(?:\+61|0)1900 ?\d{6})$/.test(value) && value !== '') {
                setError('Invalid phone number');
            } else {
                setError(null); // Clear error if valid
            }
        }

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

        if (!/^(?:(?:\+61|0)4\d{2} ?\d{3} ?\d{3}|(?:\+61|0)(2|3|7|8)\d{8}|(?:\+61|0)1800 ?\d{3} ?\d{3}|(?:\+61|0)13\d{6}|(?:\+61|0)1900 ?\d{6})$/.test(updatedAccountData.Phone)) {
            setError('Phone number is invalid');
            return;
        }

        try {
            const result = await editAccount(updatedAccountData.Username, updatedAccountData);
            if (result) {
                setSuccess(true);
                handleShowMessage('Account updated successfully!', 'success');
            } else {
                setError('Failed to update account.');
                handleShowMessage('Failed to update account.', 'error');
            }
        } catch (err) {
            setError('An error occurred while updating the account.');
            handleShowMessage('An error occurred while updating the account.', 'error');
            console.error(err);
        }
    };

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 2, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                        <AccountCircleIcon sx={{ fontSize: 80, mb: 2, alignItems: 'center' }}/>
                        <Typography variant="h3" component="h3" >
                            Account Details
                        </Typography>
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
                                        style: { backgroundColor: '#f5f5f5' }, // Grey background to indicate view-only
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
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
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    error={!!error}
                                />
                                {error && <Typography color="error">{error}</Typography>}
                            </Grid>  
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Role"
                                    name="companyRole"
                                    value={formData.companyRole}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        style: { backgroundColor: '#f5f5f5' }, // Grey background to indicate view-only
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenPasswordModal(true)}
                                sx={{ width: "250px", mb: 2 }}
                            >
                                Change Password
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px" }}>
                                Save Changes
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Modal open={openPasswordModal} onClose={handleClosePasswordModal}>
            <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4, 
                    maxWidth: 400, 
                    width: '100%',
                    borderRadius: 2 }}>
                    <CheckPasswordForm onClose={handleClosePasswordModal} />
                </Box>
            </Modal>
        </Box>
    );
};

export default AccountDetailsForm;
