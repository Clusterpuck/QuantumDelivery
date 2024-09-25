import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import { fetchProducts } from '../store/apiFunctions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Skeleton from '@mui/material/Skeleton';

const ProductListForm = ({ sendProductList }) =>
{
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedProducts, setAddedProducts] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() =>
    {
        const loadProducts = async () =>
        {
            setLoadingProducts(true)
            try
            {
                const productList = await fetchProducts();
                console.log("Products gained is " + JSON.stringify(productList));
                setProducts(productList);
            } catch (error)
            {
                console.error('Error fetching products:', error);
                setSnackbarMessage('Failed to load products');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally
            {
                setLoadingProducts(false);
            }
        };

        loadProducts();
    }, []);

    const handleProductChange = (event, value) =>
    {
        setSelectedProduct(value);
    };

    const handleQuantityChange = (event) =>
    {
        setQuantity(Number(event.target.value));
    };

    const handleAddProduct = () =>
    {
        if (selectedProduct)
        {
            setAddedProducts(prev =>
            {
                const existingProductIndex = prev.findIndex(product => product.id === selectedProduct.id);
                var updatedProducts;
                if (existingProductIndex !== -1)
                {
                    // Product already exists, update the quantity
                    updatedProducts = [...prev];
                    updatedProducts[existingProductIndex] = {
                        ...updatedProducts[existingProductIndex],
                        quantity: updatedProducts[existingProductIndex].quantity + quantity
                    };
                } else
                {
                    updatedProducts = [
                        ...prev,
                        { 
                            id: selectedProduct.id, 
                            name: selectedProduct.name, 
                            quantity: quantity, 
                            unitOfMeasure: selectedProduct.unitOfMeasure }
                    ];
                    // Product does not exist, add new entry
                }
                sendProductList(updatedProducts);
                return updatedProducts;
            });

            setSelectedProduct(null);
            setQuantity(1);
            setSnackbarMessage('Product added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else
        {
            setSnackbarMessage('Invalid product selected');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleRemoveProduct = (id) =>
    {
        setAddedProducts((prev) =>
        {
            const updatedProducts = prev.filter(product => product.id !== id);
            sendProductList(updatedProducts);  // Update the parent component with the new product list
            return updatedProducts;
        });

        setSnackbarMessage('Product removed successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () =>
    {
        setSnackbarOpen(false);
    };


    const commonStyles = {
        width: '100%',  // Make it responsive to parent container
        maxWidth: 400,  // Set a max width to keep it from expanding too much
        height: 'auto', // Auto-adjust height for responsiveness
    };
    const skeletonStyles = {
        ...commonStyles,
        height: 56,  // Set a fixed height for the skeleton to simulate the input field height
    };


    const ProductAutocomplete = () =>
    {

        if (loadingProducts)
        {
            return <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />;
        }

        if (products)
        {
            return (
                <Autocomplete
                    size="small"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    options={products}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Select Product" variant="outlined" fullWidth />}
                />
            );
        }

        // return <p>No Customers</p>;
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'name', headerName: 'Name', flex: 0.4 },
        { field: 'quantity', headerName: 'Quantity', flex: 0.2 },
        { field: 'unitOfMeasure', headerName: 'Unit', flex: 0.2 },

        {
            field: 'action',
            headerName: 'Action',
            flex: 0.2,
            sortable: false,
            disableClickEventBubbling: true,
            
            renderCell: (params) => {
                const onClick = (e) => {
                  const currentRow = params.row;
                  return alert(JSON.stringify(currentRow, null, 4));
                };
                
                return (
                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        onClick={()=>handleRemoveProduct(params.row.id)}>Remove</Button>
                );
            },
        }

    ];

    const rows = addedProducts.map(product => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        unitOfMeasure: product.unitOfMeasure
    }));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Grid container spacing={1}>
                <Grid item xs={7} md={7} >
                    <ProductAutocomplete />
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
                        size="small"
                    />
                </Grid>
                <Grid item xs={2} justifyContent="center">
                    <Box
                        display="flex"          // Enable flexbox
                        alignItems="center"     // Center vertically
                        justifyContent="center"  // Center horizontally (optional)
                        height="100%"           // Make Box take full height of Grid item
                    >
                        <Button
                            onClick={handleAddProduct}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            <AddIcon />
                            Add Product
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ height: 250, width: '100%', mt: 0.5 }}>
                <DataGrid
                    density="compact"
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    />
            </Box>

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
