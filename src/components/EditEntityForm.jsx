import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getAccounts, getProducts, getLocations, getCustomers } from '../store/apiFunctions'; 

const EditEntityForm = ({ entity, onSuccess }) => {
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (entityId) {
            console.log(`Editing ${entity} with ID:`, entityId);
            onSuccess(entityId); // Pass the entityId back to the parent component
        } else {
            setError(`Please provide a valid ${entity === 'user' ? 'Username' : `${entity} ID`}.`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EditIcon /> Edit {entity}
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
                        ? `${option.description}, ${option.address}, ${option.state} (Postcode: ${option.postCode})`
                        : `${option.name} (Phone: ${option.phone})`
                }
                filterOptions={(options, { inputValue }) => {
                    // filter logic based on entity type
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
                              option.state.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.description.toLowerCase().includes(inputValue.toLowerCase())
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
            <Button variant="contained" color="primary" type="submit">
                Load {entity} for Editing
            </Button>
        </Box>
    );
};

export default EditEntityForm;
