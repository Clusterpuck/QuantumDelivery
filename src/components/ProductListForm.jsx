import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { fetchProducts } from '../store/apiFunctions';

const ProductListForm = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedProducts, setAddedProducts] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productList = await fetchProducts();
                setProducts(productList);
            } catch (error) {
                console.error('Error fetching products:', error);
                setSnackbarMessage('Failed to load products');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        loadProducts();
    }, []);

    const handleProductChange = (event, value) => {
        setSelectedProduct(value);
    };

    const handleQuantityChange = (event) => {
        setQuantity(Number(event.target.value));
    };

    const handleAddProduct = () => {
        if (selectedProduct) {
            setAddedProducts(prev => {
                const existingProductIndex = prev.findIndex(product => product.id === selectedProduct.id);

                if (existingProductIndex !== -1) {
                    // Product already exists, update the quantity
                    const updatedProducts = [...prev];
                    updatedProducts[existingProductIndex] = {
                        ...updatedProducts[existingProductIndex],
                        quantity: updatedProducts[existingProductIndex].quantity + quantity
                    };
                    return updatedProducts;
                } else {
                    // Product does not exist, add new entry
                    return [
                        ...prev,
                        { id: selectedProduct.id, name: selectedProduct.name, quantity: quantity }
                    ];
                }
            });

            setSelectedProduct(null);
            setQuantity(1);
            setSnackbarMessage('Product added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage('Invalid product selected');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'quantity', headerName: 'Quantity', width: 150 }
    ];

    const rows = addedProducts.map(product => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity
    }));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, width: '100%' }}>
                <h3>Add Products to Order</h3>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Autocomplete
                            value={selectedProduct}
                            onChange={handleProductChange}
                            options={products}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Select Product" variant="outlined" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Quantity"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={quantity}
                            onChange={handleQuantityChange}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={handleAddProduct} variant="contained" color="primary" fullWidth>
                            Add Product
                        </Button>
                    </Grid>
                </Grid>

                <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} />
                </Box>
            </Paper>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductListForm;
