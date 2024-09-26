import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { getProductDetails, updateProduct } from '../store/apiFunctions';

const EditProductForm = ({ productId }) => {
    const [formData, setFormData] = useState({
        Name: '',
        UnitOfMeasure: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await getProductDetails(productId);
                if(productData)
                {
                    setFormData({
                        Name: productData.name || '',
                        UnitOfMeasure: productData.unitOfMeasure || '',
                    });
                }
                else
                {
                    setError('No product details found.');
                }
            } catch (error) {
                console.error(`Error fetching product details for ID: ${productId}`, error);
                setError('Failed to load product data, no product found.');
            }
        };

        fetchProductData();
    }, [productId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Saving changes...', formData); // Log form data
        console.log('Form Data:', formData); // Log the form data here

        try {
            const result = await updateProduct(productId, formData); // Call update function

            // Check the result or any necessary condition
            if (result) {
                setSuccess(true);
                if (!formData.Name || !formData.UnitOfMeasure) {
                    setError("Both fields are required.");
                    return; 
                }
                setSuccessMessage('Product updated successfully!');
                console.log('Product updated successfully:', result);
            } else {
                setError('Failed to update product.');
            }
        } catch (err) {
            console.error(err); // Log full error for debugging
            setError('An error occurred while updating the product.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        Editing Product {productId}
                    </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Product Name"
                                    name="Name" // Ensure this matches expected payload key
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Name} // Bind to formData
                                    onChange={handleInputChange} // Handle input change
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Unit of Measure"
                                    name="UnitOfMeasure" // Ensure this matches expected payload key
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.UnitOfMeasure} // Bind to formData
                                    onChange={handleInputChange} // Handle input change
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: "250px", mb: 2 }}>
                                Save Changes
                            </Button>
                            {error && <Typography color="error">{error}</Typography>}
                            {success && <Typography color="green">{successMessage}</Typography>}
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        </Box>
    );
};

export default EditProductForm;
