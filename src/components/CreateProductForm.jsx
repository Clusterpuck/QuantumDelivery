import React, { useState } from 'react';
import { TextField, Box, CircularProgress, Button, Grid, Typography } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { createProduct } from '../store/apiFunctions'; 

const CreateProductForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        productName: '',
        unitOfMeasure: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        setLoadingSubmit(true);
        event.preventDefault();
        console.log('Creating product...', formData);

        try {
            const result = await createProduct({
                Name: formData.productName,
                UnitOfMeasure: formData.unitOfMeasure,
            });

            if (result) {
                setSuccess(true);
                setSuccessMessage('Product created successfully!');
                setError(null); // Clear error state on success
                console.log('Product created successfully:', result);
                onClose();
            } else {
                setError('Failed to create product.');
            }
        } catch (err) {
            setError('An error occurred while creating the product.');
            console.error(err);
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Inventory2Icon sx={{ mr: 1 }} /> {/* Adds margin to the right of the icon */}
                                <Typography margin={1} variant="h4">
                                    Add Product
                                </Typography>

                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Product Name"
                                    name="productName"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Unit of Measure"
                                    name="unitOfMeasure"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.unitOfMeasure}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                            {loadingSubmit ? <CircularProgress color="secondary" size = {24}/> :  "Add Product" }
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">{successMessage}</Typography>}
                        </Grid>
                    </form>
                </Grid>
        </Box>
    );
};

export default CreateProductForm;
