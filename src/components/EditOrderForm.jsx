import React, { useEffect, useState } from 'react';
import { fetchCustomers, fetchLocations, fetchProducts } from '../store/apiFunctions.js';
import { Autocomplete, TextField, Table, TableRow, TableCell, TableBody, TableHead, TableContainer, Paper, Button, Grid, Typography, IconButton } from '@mui/material';
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
    const [selectedProducts, setSelectedProducts] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleProductChange = (newValue) => {
        setSelectedProduct(value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        loadCustomers();
        loadLocations();
        loadProducts();
    }, []);

    useEffect(() => {
        console.log("PASSED ORDER ", order);
    }, [order]);



    return (
        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
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
                                onChange={(event, newValue) => handleCustomerChange(newValue)} // Pass the whole object
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
                            value={order?.deliveryDate}
                            onChange={(e) => setSelectedDeliveryDate(e.target.value)}
                            variant="outlined"
                            fullWidth
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Status"
                            value={order?.status || ''}
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>

                {/* Order Notes */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Order Notes"
                            value={order?.orderNotes || ''}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
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
                            {products.map((product) => ( // MAPPING ALL PRODUCTS FOR NOW - should be order products
                                <TableRow key={product.productId}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.unit}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                        //onClick={}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                {/* Submit Button */}
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" sx={{ width: '200px' }}>
                        Save Changes
                    </Button>
                </Grid>
            </form>
        </Paper>
    );
};
export default EditOrderForm;