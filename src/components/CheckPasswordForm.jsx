import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
//import { handlePasswordChange } from '../store/apiFunctions'; // Assume you have this API function

const CheckPasswordForm = ({ username }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChangeOldPassword = (event) => {
        setOldPassword(event.target.value);
        setError(null); // Reset error on change
        setSuccess(false); // Reset success on change
    };

    const handleChangeNewPassword = (event) => {
        setNewPassword(event.target.value);
        setError(null); // Reset error on change
        setSuccess(false); // Reset success on change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(`Changing password for ${username}`);

        if (!oldPassword || !newPassword) {
            setError('Both password fields are required.');
            return;
        }

        try {
            // API call to change password
            const result = await handlePasswordChange(username, oldPassword, newPassword);
            if (result) {
                setSuccess(true);
            } else {
                setError('Failed to change password. Please check the old password and try again.');
            }
        } catch (err) {
            setError('An error occurred while changing the password.');
            console.error(err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LockIcon /> Change Password
            </Typography>

            <Typography variant="h6">Username: {username}</Typography> {/* Display the username */}

            <TextField
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={handleChangeOldPassword}
                required
            />

            <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={handleChangeNewPassword}
                required
            />

            <Button variant="contained" color="primary" type="submit">
                Change Password
            </Button>

            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="green">Password changed successfully!</Typography>}
        </Box>
    );
};

export default CheckPasswordForm;
