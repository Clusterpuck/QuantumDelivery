import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteAccount, deleteProduct, deleteCustomer, deleteLocation, deleteVehicle, getAccounts, getProducts, getCustomers, getLocations, getVehicles } from '../store/apiFunctions'; 

const DeleteEntityForm = ({ entity, onClose }) => {
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // fetch data based on entity type
    useEffect(() => {
        const fetchData = async () => {
            switch (entity) {
                case 'account':
                    const fetchedAccounts = await getAccounts();
                    setAccounts(fetchedAccounts || []);
                    break;
                case 'product':
                    const fetchedProducts = await getProducts();
                    setProducts(fetchedProducts || []);
                    break;
                case 'location':
                    const fetchedLocations = await getLocations();
                    setLocations(fetchedLocations || []);
                    break;
                case 'customer':
                    const fetchedCustomers = await getCustomers();
                    setCustomers(fetchedCustomers || []);
                    break;
                case 'vehicle':
                    const fetchedVehicles = await getVehicles();
                    setVehicles(fetchedVehicles || []);
                    break;
                default:
                    break;
            }
        };

        fetchData();
    }, [entity]);

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedItem(newValue);
        if (newValue) {
            switch (entity) {
                case 'account':
                    setEntityId(newValue.username);
                    break;
                case 'product':
                    setEntityId(newValue.id);
                    break;
                case 'location':
                    setEntityId(newValue.id);
                    break;
                case 'customer':
                    setEntityId(newValue.name);
                    break;
                case 'vehicle':
                    setEntityId(newValue.licensePlate); 
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
                case 'account':
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
                case 'vehicle':
                    result = await deleteVehicle(entityId);
                    break;
                default:
                    setError('Invalid entity');
                    return;
            }

            if (result) {
                setSuccess(true);
                onClose();
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
                    entity === 'account' ? accounts :
                    entity === 'product' ? products :
                    entity === 'location' ? locations :
                    entity === 'customer' ? customers :
                    vehicles
                }
                getOptionLabel={(option) =>
                    entity === 'account'
                        ? `${option.name} (${option.username})`
                        : entity === 'product'
                        ? `${option.name} (ID: ${option.id})`
                        : entity === 'location'
                        ? `${option.description}, ${option.address}, ${option.state} (Postcode: ${option.postCode})`
                        : entity === 'customer'
                        ? `${option.name} (Phone: ${option.phone})`
                        : `${option.licensePlate} (Status: ${option.status})`
                }
                filterOptions={(options, { inputValue }) => {
                    return options.filter(
                        (option) => entity === 'account'
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
                            : entity === 'customer'
                            ? option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.phone.includes(inputValue) ||
                              option.email.toLowerCase().includes(inputValue.toLowerCase())
                            : option.licensePlate.toString().includes(inputValue) ||
                              option.status.toLowerCase().includes(inputValue.toLowerCase())
                    );
                }}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={
                            entity === 'account'
                                ? 'Search by Name, Username, Phone, or Role'
                                : entity === 'product'
                                ? 'Search by ID or Name'
                                : entity === 'location'
                                ? 'Search by ID, Address, Postcode, or State'
                                : entity === 'customer'
                                ? 'Search by ID, Name, or Phone'
                                : 'Search by License Plate or Status'
                        }
                        variant="outlined"
                    />
                )}
                isOptionEqualToValue={(option, value) =>
                    entity === 'account'
                        ? option.username === value.username
                        : entity === 'product'
                        ? option.id === value.id
                        : entity === 'location'
                        ? option.id === value.id
                        : entity === 'customer'
                        ? option.name === value.name
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
