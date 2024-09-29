import React from 'react';
import { Paper, Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminControlsForm = ({ entity, handleSubmit }) => {
    return (
        <Grid item xs={12}>
            <Paper
                elevation={2}
                sx={{
                    padding: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#cedbeb', 
                    height: '50px', 
                }}
            >
                {/* entity name */}
                <Typography variant="h6" sx={{ minWidth: '150px' }}>
                    {entity.charAt(0).toUpperCase() + entity.slice(1)}
                </Typography>

                {/* Buttons for Add, Edit, and Delete */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#8fc48b', color: '#fff' }}
                        onClick={() => handleSubmit(entity, 'add')}
                        title={`Add ${entity.charAt(0).toUpperCase() + entity.slice(1)}`} // Tooltip for Add button
                    >
                        <AddIcon />
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#d6b16d', color: '#fff' }}
                        onClick={() => handleSubmit(entity, 'edit')}
                        title={`Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`} // Tooltip for Edit button
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#b57682', color: '#fff' }}
                        onClick={() => handleSubmit(entity, 'delete')}
                        title={`Delete ${entity.charAt(0).toUpperCase() + entity.slice(1)}`} // Tooltip for Delete button
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            </Paper>
        </Grid>
    );
};

export default AdminControlsForm;
