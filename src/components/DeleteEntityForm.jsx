import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteAccount, deleteProduct, deleteCustomer, deleteLocation } from '../store/apiFunctions'; 

const DeleteEntityForm = ({ entity }) => {
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (event) => {
        setEntityId(event.target.value);
        setError(null); // reset error on change
        setSuccess(false); // reset success on change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(`Delete ${entity} with ID:`, entityId);

        if (entity === 'user') {
            try {
                const result = await deleteAccount(entityId); 
                if (result) {
                    setSuccess(true); 
                } else {
                    setError('Failed to delete account.'); 
                }
            } catch (err) {
                setError('An error occurred while deleting the account.');
                console.error(err); 
            }
    
            
        }

        else if (entity === 'product') {
            try {
                const result = await deleteProduct(entityId); 
                if (result) {
                    setSuccess(true); 
                } else {
                    setError('Failed to delete product.'); 
                }
            } catch (err) {
                setError('An error occurred while deleting the product.');
                console.error(err); 
            }
    
        }

        else if (entity === 'customer') {
            try {
                const result = await deleteCustomer(entityId); 
                if (result) {
                    setSuccess(true); 
                } else {
                    setError('Failed to delete customer'); 
                }
            } catch (err) {
                setError('An error occurred while deleting the customer.');
                console.error(err); 
            }
    
        }

        else if (entity === 'location') {
            try {
                const result = await deleteLocation(entityId); 
                if (result) {
                    setSuccess(true); 
                } else {
                    setError('Failed to delete location.'); 
                }
            } catch (err) {
                setError('An error occurred while deleting the location.');
                console.error(err); 
            }
    
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DeleteIcon /> Delete {entity}
            </Typography>
            <TextField
                label={entity === 'user' ? 'Username' : `${entity} ID`}
                value={entityId}
                onChange={handleChange}
                required
            />

            <Button variant="contained" color="error" type="submit">Delete {entity}</Button>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="green">Account deleted successfully!</Typography>}
        </Box>
    );
};

export default DeleteEntityForm;
