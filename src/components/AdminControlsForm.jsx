import React from 'react';
import { Paper, Button, Grid, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

const AdminControlsForm = ({ entity, operation, handleOperationChange, handleSubmit }) => {
    return (
        <Grid item xs={12}>
            <Paper elevation={2} sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* entity name */}
                <Typography variant="h6" sx={{ minWidth: '150px' }}>
                    {entity.charAt(0).toUpperCase() + entity.slice(1)}
                </Typography>

                {/* operations dropdown */}
                <FormControl fullWidth sx={{ maxWidth: '200px', marginRight: 2 }}>
                    <InputLabel>Operation</InputLabel>
                    <Select
                        value={operation}
                        onChange={handleOperationChange(entity)}
                        label="Operation"
                        required
                    >
                        <MenuItem value="add">Add</MenuItem>
                        <MenuItem value="edit">Edit</MenuItem>
                        <MenuItem value="delete">Delete</MenuItem>
                    </Select>
                </FormControl>

                {/* submit button */}
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(entity)}
                    sx={{ marginLeft: 2 }}
                >
                    Submit
                </Button>
            </Paper>
        </Grid>
    );
};

export default AdminControlsForm;
