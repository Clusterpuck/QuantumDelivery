import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { login } from '../store/apiFunctions';
import Cookies from 'js-cookie';
import { CircularProgress } from '@mui/material';


const styleConstants = {
    fieldSpacing: { mb: 2 },
};

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingLogin, setLoadingLogin] = useState(false);

    
    const validate = () => {
        let valid = true;
        let tempErrors = { username: '', password: '' };

        // Username validation
        if (!username) {
            tempErrors.username = 'Username is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(username)) {
            tempErrors.username = 'Username must be a valid email';
            valid = false;
        }

        // Password validation
        if (!password) {
            tempErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(tempErrors);
        return valid;
    };




    const handleLogin = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setLoadingLogin(true);
                const response = await login(username, password);
                setLoadingLogin(false);
                
                if (response && response.token && response.role) {
                    // store the token and role in cookies or localStorage
                    Cookies.set('authToken', response.token, { expires: 1 });
                    Cookies.set('userRole', response.role, { expires: 1 });
                    Cookies.set('userName', username, { expires: 1 }); // Unsure if need expires, keep just in case
    
                    // redirect based on role
                    if (response.role === 'ADMIN') {
                        navigate('/home'); // redirect to Admin dashboard
                    } else if (response.role === 'DRIVER') {
                        navigate('/driverviewroutes'); // redirect to Driver dashboard
                    } else {
                        setErrorMessage('Invalid role, please contact an Admin for assistance');
                    }
                } else {
                    setErrorMessage('Invalid username, password, or role');
                }
            } catch (error) {
                console.error('Login failed:', error);
                setErrorMessage('Invalid username or password');
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, width: '100%' }}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <AccountCircleIcon sx={{ fontSize: 80, mb: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={handleLogin}>
                            <Grid item xs={12} sx={styleConstants.fieldSpacing}>
                                <TextField
                                    id='username'
                                    name='username'
                                    variant="outlined"
                                    fullWidth
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                            </Grid>
                            <Grid item xs={12} sx={styleConstants.fieldSpacing}>
                                <TextField
                                    id='password'
                                    name='password'
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                            </Grid>
                            {errorMessage && (
                                <Grid item xs={12} style={{ marginBottom: 16 }}>
                                    <Typography color="error">{errorMessage}</Typography>
                                </Grid>
                            )}
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    disabled = {loadingLogin}
                                    >
                                {loadingLogin ? <CircularProgress size={24}/> : 'Login'}
                                </Button>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                        <Typography variant="body2" color="primary">
                            Don't have an account? Get QuantaPath for your business.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default LoginForm;

