import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteEntityForm = ({ entity }) => {
    const [entityId, setEntityId] = useState('');

    const handleChange = (event) => {
        setEntityId(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`Delete ${entity} with ID:`, entityId);
        // TODO: Add logic to delete the entity
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DeleteIcon /> Delete {entity}
            </Typography>
            <TextField
                label={`${entity} ID`}
                value={entityId}
                onChange={handleChange}
                required
            />
            <Button variant="contained" color="error" type="submit">Delete {entity}</Button>
        </Box>
    );
};

export default DeleteEntityForm;
