import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteAccount, deleteProduct, deleteCustomer, deleteLocation, getAccounts, getProducts, getCustomers, getLocations } from '../store/apiFunctions'; 

const DeleteEntityForm = ({ entity }) => {
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // fetch data based on entity type
    useEffect(() => {
        if (entity === 'user') {
            const fetchAccounts = async () => {
                const fetchedAccounts = await getAccounts();
                setAccounts(fetchedAccounts || []); // Set to an empty array if null
            };
            fetchAccounts();
        } else if (entity === 'product') {
            const fetchProducts = async () => {
                const fetchedProducts = await getProducts();
                setProducts(fetchedProducts || []); // Set to an empty array if null
            };
            fetchProducts();
        } else if (entity === 'location') {
            const fetchLocations = async () => {
                const fetchedLocations = await getLocations();
                setLocations(fetchedLocations || []); // Set to an empty array if null
            };
            fetchLocations();
        } else if (entity === 'customer') {
            const fetchCustomers = async () => {
                const fetchedCustomers = await getCustomers();
                setCustomers(fetchedCustomers || []); // Set to an empty array if null
            };
            fetchCustomers();
        }
    }, [entity]);

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedItem(newValue);
        if (newValue) {
            switch (entity) {
                case 'user':
                    setEntityId(newValue.username);
                    break;
                case 'product':
                    setEntityId(newValue.id);
                    break;
                case 'location':
                    setEntityId(newValue.id);
                    break;
                case 'customer':
                    setEntityId(newValue.id);
                    break;
                default:
                    setEntityId('');
            }
        } else {
            setEntityId('');
        }
        setError(null); // reset error on change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(`Delete ${entity} with ID:`, entityId);

        try {
            let result;
            switch (entity) {
                case 'user':
                    result = await deleteAccount(entityId);
                    break;
                case 'product':
                    result = await deleteProduct(entityId);
                    break;
                case 'customer':
                    result = await deleteCustomer(entityId);
                    break;
                case 'location':
                    result = await deleteLocation(entityId);
                    break;
                default:
                    setError('Invalid entity');
                    return;
            }

            if (result) {
                setSuccess(true);
            } else {
                setError(`Failed to delete ${entity}.`);
            }
        } catch (err) {
            setError(`An error occurred while deleting the ${entity}.`);
            console.error(err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DeleteIcon /> Delete {entity}
            </Typography>
            <Autocomplete
                options={
                    entity === 'user' ? accounts :
                    entity === 'product' ? products :
                    entity === 'location' ? locations :
                    customers
                }
                getOptionLabel={(option) =>
                    entity === 'user'
                        ? `${option.name} (${option.username})`
                        : entity === 'product'
                        ? `${option.name} (ID: ${option.id})`
                        : entity === 'location'
                        ? `${option.address}, ${option.state} (Postcode: ${option.postCode})`
                        : `${option.name} (Phone: ${option.phone})`
                }
                filterOptions={(options, { inputValue }) => {
                    // custom filter logic based on entity type
                    return options.filter(
                        (option) => entity === 'user'
                            ? option.username.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.phone.includes(inputValue) ||
                              option.role.toLowerCase().includes(inputValue.toLowerCase())
                            : entity === 'product'
                            ? option.id.toString().includes(inputValue) ||
                              option.name.toLowerCase().includes(inputValue.toLowerCase())
                            : entity === 'location'
                            ? option.id.toString().includes(inputValue) ||
                              option.address.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.postCode.toString().includes(inputValue) ||
                              option.state.toLowerCase().includes(inputValue.toLowerCase())
                            : option.id.toString().includes(inputValue) ||
                              option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.phone.includes(inputValue)
                    );
                }}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={
                            entity === 'user'
                                ? 'Search by Name, Username, Phone, or Role'
                                : entity === 'product'
                                ? 'Search by ID or Name'
                                : entity === 'location'
                                ? 'Search by ID, Address, Postcode, or State'
                                : 'Search by ID, Name, or Phone'
                        }
                        variant="outlined"
                        error={!!error}
                        helperText={error}
                    />
                )}
                isOptionEqualToValue={(option, value) =>
                    entity === 'user'
                        ? option.username === value.username
                        : entity === 'product'
                        ? option.id === value.id
                        : option.id === value.id
                }
            />
            <Button variant="contained" color="error" type="submit">
                Delete {entity}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="green">{`${entity} deleted successfully!`}</Typography>}
        </Box>
    );
};

export default DeleteEntityForm;
