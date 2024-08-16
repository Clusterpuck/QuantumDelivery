import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';

const styleConstants = {
    fieldSpacing: { mb: 2 },
};

const LoginForm = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        // TO DO: add user authentication logic here
        e.preventDefault();
        navigate('/addorder');
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
                                />
                            </Grid>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                        <Typography variant="body2" color = "primary">
                            Don't have an account? {' '}
                            <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                                        Register
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default LoginForm;
