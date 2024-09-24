import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditEntityForm = ({ entity, onSuccess }) => {
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setEntityId(event.target.value);
        setError(null); // Reset error on change
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (entityId) {
            console.log(`Editing ${entity} with ID:`, entityId);
            onSuccess(entityId); // Pass the entityId back to the parent component
        } else {
            setError(`Please provide a valid ${entity === 'user' ? 'Username' : `${entity} ID`}.`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EditIcon /> Edit {entity}
            </Typography>
            <TextField
                label={entity === 'user' ? 'Username' : `${entity} ID`}
                value={entityId}
                onChange={handleChange}
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Load {entity} for Editing
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default EditEntityForm;
