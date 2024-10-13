import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Autocomplete, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getAccounts, getProducts, getLocations, getCustomers, getVehicles } from '../store/apiFunctions';

const EditEntityForm = ({ entity, onSuccess }) => {
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch data based on entity type
    useEffect(() => {
        const fetchEntities = async () => {
            let fetchedEntities;
            switch (entity) {
                case 'account':
                    fetchedEntities = await getAccounts();
                    setAccounts(fetchedEntities || []);
                    break;
                case 'product':
                    fetchedEntities = await getProducts();
                    setProducts(fetchedEntities || []);
                    break;
                case 'location':
                    fetchedEntities = await getLocations();
                    setLocations(fetchedEntities || []);
                    break;
                case 'customer':
                    fetchedEntities = await getCustomers();
                    setCustomers(fetchedEntities || []);
                    break;
                case 'vehicle':
                    fetchedEntities = await getVehicles();
                    setVehicles(fetchedEntities || []);
                    break;
                default:
                    break;
            }
        };

        fetchEntities();
    }, [entity]);

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedItem(newValue);
        if (newValue) {
            switch (entity) {
                case 'account':
                    setEntityId(newValue.username);
                    break;
                case 'product':
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
        setError(null); // Reset error on change
    };

    const handleSubmit = (event) => {
        setLoadingSubmit(true);
        event.preventDefault();
        if (entityId) {
            console.log(`Editing ${entity} with ID:`, entityId);
            onSuccess(entityId); // Pass the entityId back to the parent component
        } else {
            setError(`Please provide a valid ${entity === 'account' ? 'Username' : `${entity} ID`}.`);
        }
        setLoadingSubmit(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" component="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EditIcon /> Edit {entity}
            </Typography>
            <Autocomplete
                options={
                    entity === 'account' ? accounts :
                    entity === 'product' ? products :
                    entity === 'location' ? locations :
                    entity === 'customer' ? customers :
                    entity === 'vehicle' ? vehicles :
                    []
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
                        : `${option.licensePlate} (Make: ${option.make}, Model: ${option.model}, Status: ${option.status})`
                }
                filterOptions={(options, { inputValue }) => {
                    // Filter logic based on entity type
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
                              option.make.toLowerCase().includes(inputValue.toLowerCase()) || // Include make in filter
                              option.model.toLowerCase().includes(inputValue.toLowerCase()) || // Include model in filter
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
                                : 'Search by License Plate, Make, Model, or Status' // Update label
                        }
                        variant="outlined"
                        error={!!error}
                        helperText={error}
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
                        ? option.id === value.id
                        : option.licensePlate === value.licensePlate
                }
            />
            <Button variant="contained" color="primary" type="submit">
                {loadingSubmit ? <CircularProgress color="secondary" size={24} /> : ("Load " + entity + " for Editing")}
            </Button>
        </Box>
    );
};

export default EditEntityForm;
