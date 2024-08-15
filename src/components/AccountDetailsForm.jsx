import React from 'react';
import { TextField, Box, Paper, Button, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

// TO DO: make it so it stores user data here, right now it just a copy paste of the rego form

const AccountDetailsForm = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                        <AccountCircleIcon sx={{ fontSize: 80, mb: 2, alignItems: 'center'}}/>
                    </Grid>
                    <Grid item>

                    </Grid>
                    <form style={{ width: '80%', alignItems: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={18} sm={6}>
                                <TextField 
                                    label="Full Name"
                                    name="fullName"
                                    variant="outlined"
                                    fullWidth
                                    required
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Name"
                                    name="companyName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Phone"
                                    name="companyPhone"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Company Role"
                                    name="companyRole"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
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
