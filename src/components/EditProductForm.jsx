import React, { useState, useEffect } from 'react';
import { TextField, Box, Paper, Button, Grid, Typography } from '@mui/material';
import { getProductDetails, updateProduct } from '../store/apiFunctions';
import BackpackIcon from '@mui/icons-material/Backpack';

const EditProductForm = ({ productId, onClose }) => {
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
        console.log('Saving changes...', formData); 
        console.log('Form Data:', formData);

        try {
            const result = await updateProduct(productId, formData); // update in db

            // check result
            if (result) {
                setSuccess(true);
                if (!formData.Name || !formData.UnitOfMeasure) {
                    setError("Both fields are required.");
                    return; 
                }
                setSuccessMessage('Product updated successfully!');
                console.log('Product updated successfully:', result);
                onClose();
            } else {
                setError('Failed to update product.');
            }
        } catch (err) {
            console.error(err); 
            setError('An error occurred while updating the product.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <BackpackIcon />
                    <Typography variant="h5" margin={1}>
                        Editing Product 
                    </Typography>
                    <Typography variant='subheading'>
                        {productId}
                    </Typography>
                    <form style={{ width: '80%' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Product Name"
                                    name="Name" 
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.Name} 
                                    onChange={handleInputChange} 
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Unit of Measure"
                                    name="UnitOfMeasure" 
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={formData.UnitOfMeasure} 
                                    onChange={handleInputChange} 
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
        </Box>
    );
};

export default EditProductForm;
