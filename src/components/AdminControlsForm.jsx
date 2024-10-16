import React from 'react';
import { Paper, Button, Grid, Typography, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AdminControlsForm = ({ entity, handleSubmit, Icon }) => {
    return (
        <Grid item xs={12}>
            <Paper
                elevation={2}
                sx={{
                    padding: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#cedbeb', 
                    height: '50px', 
                }}
            >
                {/* entity name */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon />
                <Typography 
                variant="h6" 
                sx={{ 
                    minWidth: '150px', 
                    textAlign: 'left',
                    marginLeft: '16px' 
                }}
                >
                    {entity.charAt(0).toUpperCase() + entity.slice(1)}
                </Typography>
                </div>

                {/* Buttons for Add, Edit, and Delete */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Tooltip arrow title = {`Add ${entity.charAt(0).toUpperCase() + entity.slice(1)}`} >
                    <Button 
                        variant="contained"
                        sx={{ backgroundColor: '#8fc48b', color: '#fff' }}
                        onClick={() => handleSubmit(entity, 'add')}
                    >
                        <AddIcon />
                    </Button>
                    </Tooltip>
                    <Tooltip arrow title = {`Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#d6b16d', color: '#fff' }}
                        onClick={() => handleSubmit(entity, 'edit')}
                    >
                        <EditIcon />
                    </Button>
                    </Tooltip>
                    <Tooltip arrow title={`Delete ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#b57682', color: '#fff' }}
                        onClick={() => handleSubmit(entity, 'delete')}
                    >
                        <DeleteIcon />
                    </Button>
                    </Tooltip>
                </div>
            </Paper>
        </Grid>
    );
};

export default AdminControlsForm;
