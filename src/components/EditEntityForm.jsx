import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getAccounts, getProducts, getLocations, getCustomers, getVehicles } from '../store/apiFunctions'; 

const EditEntityForm = ({ entity, onSuccess }) => {
    const [entityId, setEntityId] = useState('');
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    // fetch data based on entity type
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
                case 'customer':
                    setEntityId(newValue.id);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (entityId) {
            console.log(`Editing ${entity} with ID:`, entityId);
            onSuccess(entityId); // Pass the entityId back to the parent component
        } else {
            setError(`Please provide a valid ${entity === 'account' ? 'Username' : `${entity} ID`}.`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
                        : `${option.licensePlate} (Status: ${option.status})`
                }
                filterOptions={(options, { inputValue }) => {
                    // filter logic based on entity type
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
                            ? option.id.toString().includes(inputValue) ||
                              option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                              option.phone.includes(inputValue)
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
