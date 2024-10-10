import React, { useEffect, useState, useCallback  } from 'react';
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
import Skeleton from '@mui/material/Skeleton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Input} from '@mui/material';
import {Tooltip} from '@mui/material';

const ProductListForm = React.memo(({ addedProducts, setAddedProducts }) =>
{
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    //const [addedProducts, setAddedProducts] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isQuantityValid, setIsQuantityValid] = useState(true);


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

    // const handleProductChange = (event, value) =>
    // {
    //     setSelectedProduct(value);
    // };
    
    const handleProductChange = useCallback((event, value) => {
        setSelectedProduct(value);
    }, []);

    const handleQuantityChange = (event) =>
    {
        const value = event.target.value
        setQuantity(value)
        if( !Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 999)
        {
            setIsQuantityValid(false);
        }
        else{
            setIsQuantityValid(true);
        }
    };

    const handleAddProduct = () =>
    {
        if (selectedProduct && isQuantityValid)
        {
            setAddedProducts(prev =>
            {
                const existingProductIndex = prev.findIndex(product => product.id === selectedProduct.id);
                let updatedProducts = [...prev];
                if (existingProductIndex !== -1)
                {
                    const currentQuantity = updatedProducts[existingProductIndex].quantity;
                    const newQuantity = Math.min(999, currentQuantity + Number(quantity)); // Ensure total does not exceed 999

                    updatedProducts[existingProductIndex] = {
                        ...updatedProducts[existingProductIndex],
                        quantity: newQuantity // Use the validated new quantity
                    };
                } else
                {
                    updatedProducts = [
                        ...prev,
                        { 
                            id: selectedProduct.id, 
                            name: selectedProduct.name, 
                            quantity: Math.min(999, Number(quantity)), 
                            unitOfMeasure: selectedProduct.unitOfMeasure }
                    ];
                    // Product does not exist, add new entry
                }
                return updatedProducts;
            });

            setSelectedProduct(null);
            setQuantity(1);
           
        } 
    };

    const handleRemoveProduct = (id) =>
    {
        setAddedProducts((prev) =>
        {
            const updatedProducts = prev.filter(product => product.id !== id);
            return updatedProducts;
        });

    };

    const handleSnackbarClose = () =>
    {
        setSnackbarOpen(false);
    };

    const handleTableQuantityChange = (productID, newQuantity) => {
        const quantity = Math.floor(Number(newQuantity));
        const updatedProducts = addedProducts.map((product) =>
            product.id === productID
                ? { ...product, quantity: Math.max(1, Math.min(999, Number(quantity))) }
                : product
        );
        setAddedProducts(updatedProducts);
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

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'name', headerName: 'Name', flex: 0.4 },
        {
            field: 'editQuanity',
            headerName: '',
            flex: 0.2,
            sortable: false,
            disableClickEventBubbling: true,
            
            renderCell: (params) => {
                return (
                    <Input
                        type="number"
                        value={params.row.quantity}
                        inputProps={{ min: 1, max: 999 }}  // Prevent going below 1
                        onChange={(e) => handleTableQuantityChange(params.row.id, e.target.value)}
                    />
                );
            },
        },
        { field: 'unitOfMeasure', headerName: 'Unit', flex: 0.2 },

        {
            field: 'action',
            headerName: '',
            flex: 0.2,
            sortable: false,
            disableClickEventBubbling: true,
            
            renderCell: (params) => {
                return (
                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        onClick={()=>handleRemoveProduct(params.row.id)}><DeleteIcon/></Button>
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
                    {loadingProducts ? (
                        <Skeleton variant="rectangular" animation="wave" sx={skeletonStyles} />
                    ) : (
                        <Autocomplete
                            size="small"
                            value={selectedProduct}
                            onChange={handleProductChange}
                            options={products}
                            getOptionLabel={(option) => `${option.name} (${option.unitOfMeasure})`}
                            renderInput={(params) => <TextField {...params} label="Select Product" variant="outlined" fullWidth />}
                        />
                    )}
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={quantity}
                        onChange={handleQuantityChange}
                        size="small"
                        error={!isQuantityValid} // Set error prop based on validity
                        helperText={!isQuantityValid ? "Quantity must be a whole number between 1 and 999" : ""}
                    />
                </Grid>
                <Grid item xs={2} justifyContent="center">
                    <Box
                        display="flex"          // Enable flexbox
                        alignItems="center"     // Center vertically
                        justifyContent="center"  // Center horizontally (optional)
                        height="100%"           // Make Box take full height of Grid item
                    >
                        <Tooltip title={!selectedProduct ? "Select a product to add" : ""} arrow>
                            <span>
                                <Button
                                    onClick={handleAddProduct}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={!selectedProduct || !isQuantityValid}
                                >
                                    Add Product
                                </Button>
                            </span>
                        </Tooltip>
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
});

export default ProductListForm;
