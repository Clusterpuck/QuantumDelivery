import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { changePassword } from '../store/apiFunctions'; 

const CheckPasswordForm = ({ username }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirmation
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChangeOldPassword = (event) => {
        setOldPassword(event.target.value);
        setError(null); 
        setSuccess(false); 
    };

    const handleChangeNewPassword = (event) => {
        setNewPassword(event.target.value);
        setError(null); 
        setSuccess(false); 
    };

    const handleChangeConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
        setError(null);
        setSuccess(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(`Changing password for ${username}`);
    
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All password fields are required.');
            return;
        }
    
        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }
    
        try {
            // API call to change password
            const result = await changePassword(username, oldPassword, newPassword);
            if (result) {
                console.log(result);  // "Password changed successfully!"
                setSuccess(true); // If you want to indicate success
            } else {
                console.error('Password change failed');
                setError('Password change failed.');
            }
        }   
        catch (err) {
            console.error('Error object:', err); // Log the entire error object for debugging
            if (err.response) {
                // Check for a response from the server
                setError(err.response.data.message || 'An error occurred.');
                console.error(`Error: ${err.response.data.message}`);
            } else {
                // If there's no response, log a more general error message
                setError('An error occurred while changing the password.');
                console.error('Error without response:', err);
            }
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
                type={showPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={handleChangeOldPassword}
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleChangeNewPassword}
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
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
