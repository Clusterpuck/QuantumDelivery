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

    // Fetch data based on entity type
    useEffect(() => {
        const fetchEntities = async () => {
            try {
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
            } catch (err) {
                console.error(`Error fetching ${entity}s:`, err);
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchEntities();
    }, [entity]);

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedItem(newValue);
        if (newValue) {
            switch (entity) {
                case 'account':
                    setEntityId(newValue.username);  // For accounts, use username as the identifier
                    break;
                case 'product':
                case 'location':
                case 'customer':
                    setEntityId(newValue.id);  // For other entities, use their ID
                    break;
                case 'vehicle':
                    setEntityId(newValue.licensePlate);  // For vehicles, use the licensePlate as the identifier
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
        event.preventDefault();
        if (entityId) {
            console.log(`Editing ${entity} with ID:`, entityId);
            onSuccess(entityId); // Pass the entityId back to the parent component
        } else {
            setError(`Please provide a valid ${entity === 'account' ? 'Username' : `${entity} ID`}.`);
        }
    };

    // Define options based on entity type
    const getOptions = () => {
        switch (entity) {
            case 'account':
                return accounts;
            case 'product':
                return products;
            case 'location':
                return locations;
            case 'customer':
                return customers;
            case 'vehicle':
                return vehicles;
            default:
                return [];
        }
    };

    // Define how to render option labels
    const getOptionLabel = (option) => {
        switch (entity) {
            case 'account':
                return `${option.name} (${option.username})`;
            case 'product':
                return `${option.name} (ID: ${option.id})`;
            case 'location':
                return `${option.description}, ${option.address}, ${option.state} (Postcode: ${option.postCode})`;
            case 'customer':
                return `${option.name} (Phone: ${option.phone})`;
            case 'vehicle':
                return `${option.licensePlate ?? 'N/A'} (Status: ${option.status ?? 'Unknown'})`;
            default:
                return '';
        }
    };

    // Define filter logic based on entity type
    const filterOptions = (options, { inputValue }) => {
        return options.filter((option) => {
            switch (entity) {
                case 'account':
                    return (
                        (option.username?.toLowerCase().includes(inputValue.toLowerCase())) ||
                        (option.name?.toLowerCase().includes(inputValue.toLowerCase())) ||
                        (option.phone?.includes(inputValue)) ||
                        (option.role?.toLowerCase().includes(inputValue.toLowerCase()))
                    );
                case 'product':
                    return (
                        (option.id?.toString().includes(inputValue)) ||
                        (option.name?.toLowerCase().includes(inputValue.toLowerCase()))
                    );
                case 'location':
                    return (
                        (option.id?.toString().includes(inputValue)) ||
                        (option.address?.toLowerCase().includes(inputValue.toLowerCase())) ||
                        (option.postCode?.toString().includes(inputValue)) ||
                        (option.state?.toLowerCase().includes(inputValue.toLowerCase())) ||
                        (option.description?.toLowerCase().includes(inputValue.toLowerCase()))
                    );
                case 'customer':
                    return (
                        (option.id?.toString().includes(inputValue)) ||
                        (option.name?.toLowerCase().includes(inputValue.toLowerCase())) ||
                        (option.phone?.includes(inputValue))
                    );
                case 'vehicle':
                    return (
                        option.licensePlate?.toLowerCase().includes(inputValue.toLowerCase()) || 
                        option.status?.toLowerCase().includes(inputValue.toLowerCase())
                    );
                default:
                    return false;
            }
        });
    };

    // Define how to check if two options are equal
    const isOptionEqualToValue = (option, value) => {
        switch (entity) {
            case 'account':
                return option.username === value.username;
            case 'product':
            case 'location':
            case 'customer':
            case 'vehicle':
                return option.id === value.id;
            default:
                return false;
        }
    };

    // Define the label for the search input based on entity type
    const getSearchLabel = () => {
        switch (entity) {
            case 'account':
                return 'Search by Name, Username, Phone, or Role';
            case 'product':
                return 'Search by ID or Name';
            case 'location':
                return 'Search by ID, Address, Postcode, or State';
            case 'customer':
                return 'Search by ID, Name, or Phone';
            case 'vehicle':
                return 'Search by License Plate or Status';
            default:
                return 'Search';
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EditIcon /> Edit {entity.charAt(0).toUpperCase() + entity.slice(1)}
            </Typography>
            <Autocomplete
                options={getOptions()}
                getOptionLabel={getOptionLabel}
                filterOptions={filterOptions}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={getSearchLabel()}
                        variant="outlined"
                        error={!!error}
                        helperText={error}
                    />
                )}
                isOptionEqualToValue={isOptionEqualToValue}
                noOptionsText={`No ${entity}s found`}
            />
            <Button variant="contained" color="primary" type="submit">
                Load {entity.charAt(0).toUpperCase() + entity.slice(1)} for Editing
            </Button>
        </Box>
    );
};

export default EditEntityForm;
