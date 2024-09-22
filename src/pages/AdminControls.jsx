import React, { useState } from 'react';
import { Paper, Grid, Typography, Modal, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import AdminControlsForm from '../components/AdminControlsForm';
import DeleteEntityForm from '../components/DeleteEntityForm';
import AccountForm from '../components/AccountForm';

// Function to retrieve the 'userName' from the cookie
const getUsernameFromCookie = () => {
    const name = 'userName='; // Updated to match the set cookie name
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
};


const AdminControls = () => {
    const navigate = useNavigate();

    const [operations, setOperations] = useState({
        user: 'add',
        customer: 'add',
        location: 'add',
        product: 'add'
    });

    const [deleteEntity, setDeleteEntity] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAccountForm, setOpenAccountForm] = useState(false);
    const [userMode, setUserMode] = useState('add'); // Keep track of the mode for the user form
    const [accountId, setAccountId] = useState(''); // Track accountId when editing

    const handleOperationChange = (entity) => (event) => {
        setOperations({
            ...operations,
            [entity]: event.target.value
        });
    };

    const handleSubmit = (entity) => (event) => {
        event.preventDefault();
        const operation = operations[entity];

        if (operation === 'delete') {
            setDeleteEntity(entity);
            setOpenDelete(true);
        } else if (entity === 'user' && (operation === 'add' || operation === 'edit')) {
            // Set user mode before opening the form
            setUserMode(operation);

            // If editing, retrieve the username from the cookie and set the accountId
            if (operation === 'edit') {
                const username = getUsernameFromCookie();
                setAccountId(username);
            } else {
                setAccountId(''); // No accountId when adding a new user
            }

            setOpenAccountForm(true);
        } else if (entity !== 'user') {
            console.log(`Submitted operation for ${entity}:`, operation);
            navigate('/addorder');
        }
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleCloseAccountForm = () => {
        setOpenAccountForm(false);
    };

    const entities = ['user', 'customer', 'location', 'product'];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
            }}
        >
            <Typography
                variant="h1"
                component="h1"
                sx={{ 
                    mt: 3,
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    fontWeight: 'bold', 
                    fontSize: '3rem', 
                    mb: 3 
                }}
            >
                <SettingsIcon sx={{ fontSize: 50 }} />
                Admin Controls
            </Typography>

            <Paper elevation={3} sx={{ padding: 6, maxWidth: 800, width: '100%' }}>
                <Grid container spacing={2} justifyContent="center">
                    {entities.map((entity) => (
                        <AdminControlsForm
                            key={entity}
                            entity={entity}
                            operation={operations[entity]}
                            handleOperationChange={handleOperationChange}
                            handleSubmit={handleSubmit}
                        />
                    ))}
                </Grid>
            </Paper>

            {/* Delete Form Modal */}
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="delete-entity-modal"
                aria-describedby="delete-entity-description"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxWidth: 400,
                        width: '100%',
                    }}
                >
                    {deleteEntity && (
                        <DeleteEntityForm 
                            entity={deleteEntity} 
                        />
                    )}
                </Box>
            </Modal>

            {/* Account Form Modal */}
            <Modal
                open={openAccountForm}
                onClose={handleCloseAccountForm}
                aria-labelledby="account-form-modal"
                aria-describedby="account-form-description"
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxWidth: 600,
                        width: '100%',
                    }}
                >
                    {/* Pass the userMode and accountId to the AccountForm */}
                    <AccountForm mode={userMode} accountId={accountId} />
                </Box>
            </Modal>

        </div>
    );
};

export default AdminControls;
