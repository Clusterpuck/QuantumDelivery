import React, { useEffect, useState } from 'react';
import { fetchCustomers, fetchLocations, fetchProducts, updateOrderDetails } from '../store/apiFunctions.js';
import { Input, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField, Table, TableRow, TableCell, TableBody, TableHead, TableContainer, Paper, Button, Grid, Typography, IconButton ,  Snackbar, Alert} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import DeleteIcon from '@mui/icons-material/Delete';
import '../index.css';

const EditOrderForm = ({ order }) => {
    const [customers, setCustomers] = useState(null);
    const [locations, setLocations] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(dayjs());
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [orderNotes, setOrderNotes] = useState('');
    const [products, setProducts] = useState([]);
    const [newProductId, setNewProductId] = useState('');

    const [message, setMessage] = useState(''); // New state for message
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

    const statuses = ["PLANNED", "ASSIGNED", "ON-ROUTE", "DELIVERED", "CANCELLED", "ISSUE"];
    const allowedStatuses = ["CANCELLED", "DELIVERED", "PLANNED"];
    const [selectedStatus, setSelectedStatus] = useState('');

    const loadCustomers = async () => {
        const tempCustomers = await fetchCustomers();
        setCustomers(tempCustomers);
    };

    const loadLocations = async () => {
        const tempLocations = await fetchLocations();
        setLocations(tempLocations);
    };

    const loadProducts = async () => {
        const productList = await fetchProducts();
        setProducts(productList);
    };

    const handleCustomerChange = (newValue) => {
        setSelectedCustomer(newValue);
    };

    const handleLocationChange = (newValue) => {
        setSelectedLocation(newValue);
    };

    const handleDeleteProduct = (productID) => {
        const updatedProducts = selectedProducts.filter((product) => product.productID !== productID);
        setSelectedProducts(updatedProducts); 
    };

    const handleQuantityChange = (productID, newQuantity) => {
        const updatedProducts = selectedProducts.map((product) =>
            product.productID === productID
                ? { ...product, quantity: Math.max(1, newQuantity) }
                : product
        );
        setSelectedProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        const productToAdd = products.find((product) => product.id === newProductId);
        if (productToAdd) {
            const updatedProduct = { 
                ...productToAdd, 
                productID: productToAdd.id,  // Map `id` to `productID`
                quantity: 1  
            };
            const updatedProducts = [...selectedProducts, updatedProduct];
            setSelectedProducts(updatedProducts);
            setNewProductId(''); 
        }
    };

    const handleSaveChanges = async () => {
        // format the input data as expected by the updateOrderDetails function
        const input = {
            orderId: order.orderID,
            status: selectedStatus,
            customerId: selectedCustomer?.id,
            locationId: selectedLocation?.id,
            deliveryDate: selectedDeliveryDate.toISOString(),
            orderNotes,
            products: selectedProducts.map((product) => ({
                productId: product.productID,
                quantity: product.quantity
            }))
        };

        try {
            await updateOrderDetails(input);
            const responseMessage = await updateOrderDetails(input);
            setMessage(responseMessage); 
            setOpenSnackbar(true); 
        } catch (error) {
            console.error('Failed to save changes:', error);
        }
    };

    useEffect(() => {
        loadCustomers();
        loadLocations();
        loadProducts();
    }, []);

    useEffect(() => {
        if (order && customers && locations) {
            setSelectedDeliveryDate(order?.deliveryDate ? dayjs(order.deliveryDate) : dayjs());
            setSelectedProducts(order?.products || []);
            setOrderNotes(order?.orderNotes || []);
            setSelectedStatus(order?.status);
            const matchedCustomer = customers.find(customer => customer.name === order?.customerName);
            setSelectedCustomer(matchedCustomer);
            const matchedLocation = locations.find(location => location.address === order?.address);
            setSelectedLocation(matchedLocation);
        }
    }, [order, customers, locations]);

    const availableProducts = products.filter(product => 
        !selectedProducts.some(selected => selected.productID === product.id)
    );



    return (
        <Paper elevation={3} sx={{ padding: 3, width: '700px' }}>
            <form>
                {/* Title and Disabled Order ID */}
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5" component="h1">
                            Edit Order
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Order ID"
                            value={order?.orderID || ''}
                            disabled
                            variant="outlined"
                            sx={{ width: '200px' }}
                        />
                    </Grid>
                </Grid>

                {/* Location, Customer, Delivery Date, Status Fields */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={6}>
                        {customers ? (
                            <Autocomplete
                                disablePortal
                                id="Customers"
                                value={customers?.find(customer => customer.name === order?.customerName) || null} // Find the matching customer object
                                options={customers}
                                getOptionLabel={(option) => option.name}
                                getOptionKey={(option) => option.id}
                                fullWidth
                                onChange={(event, newValue) => handleCustomerChange(newValue)}
                                renderInput={(params) => <TextField {...params} label="Select Customer" />}
                            />
                        ) : (
                            <p>No Customers</p>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {locations ? (
                            <Autocomplete
                                disablePortal
                                id="Locations"
                                value={locations?.find(loc => loc.address === order?.address) || null} // Find the matching location object
                                options={locations}
                                getOptionLabel={(option) => option.address}
                                getOptionKey={(option) => option.id}
                                fullWidth
                                onChange={(event, newValue) => handleLocationChange(newValue)} // Pass the whole object
                                renderInput={(params) => <TextField {...params} label="Select Location" />}
                            />
                        ) : (
                            <p>No Locations</p>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Delivery Date"
                            value={selectedDeliveryDate.format('YYYY-MM-DD')}  // Format the date for input
                            onChange={(e) => setSelectedDeliveryDate(dayjs(e.target.value))}
                            variant="outlined"
                            fullWidth
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* Dropdown for Status */}
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                label="Status"
                            >
                                {/* Display all statuses in a disabled state if they are not in the allowed list */}
                                {statuses.map((status) => (
                                    <MenuItem key={status} value={status} disabled={!allowedStatuses.includes(status)}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Order Notes */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Order Notes"
                            value={orderNotes || ''}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Grid>
                </Grid>

                <Typography align="left" variant="h6" component="h2" sx={{ mt: 3 }}>
                    Products
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--background-colour)' }}>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedProducts.length > 0 ? (
                                selectedProducts.map((product) => (
                                    <TableRow key={product.productID}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={product.quantity}
                                                inputProps={{ min: 1 }}  // Prevent going below 1
                                                onChange={(e) => handleQuantityChange(product.productID, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>{product.unitOfMeasure}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleDeleteProduct(product.productID)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No products in this order.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dropdown for New Product Selection */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={8}>
                        <FormControl fullWidth>
                            <InputLabel>Add Product</InputLabel>
                            <Select
                                value={newProductId}
                                onChange={(e) => setNewProductId(e.target.value)}
                                label="Add Product"
                            >
                                {availableProducts.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddProduct}
                            disabled={!newProductId}
                            fullWidth
                            sx={{ height: '56px' }}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>


                {/* Submit Button */}
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" sx={{ width: '200px' }} onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Grid>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <Alert onClose={() => setOpenSnackbar(false)} severity={message.startsWith('Error') ? 'error' : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};
export default EditOrderForm;