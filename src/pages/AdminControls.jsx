import React, { useState } from 'react';
import { Paper, Grid, Typography, Modal, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import AdminControlsForm from '../components/AdminControlsForm';
import DeleteEntityForm from '../components/DeleteEntityForm';
import CreateAccountForm from '../components/CreateAccountForm';
import EditAccountForm from '../components/EditAccountForm'; // Edit form for user
import EditEntityForm from '../components/EditEntityForm'; // Form to collect ID

const AdminControls = () => {
    const navigate = useNavigate();

    const [operations, setOperations] = useState({
        user: 'add',
        customer: 'add',
        location: 'add',
        product: 'add',
    });

    const [deleteEntity, setDeleteEntity] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAccountForm, setOpenAccountForm] = useState(false);
    const [openEditEntityForm, setOpenEditEntityForm] = useState(false); // Modal for EditEntityForm
    const [userMode, setUserMode] = useState('add'); // 'add' or 'edit' for user form
    const [accountId, setAccountId] = useState(''); // Holds accountId when editing

    const handleOperationChange = (entity) => (event) => {
        setOperations({
            ...operations,
            [entity]: event.target.value,
        });
    };

    const handleSubmit = (entity) => (event) => {
        event.preventDefault();
        const operation = operations[entity];

        if (operation === 'delete') {
            setDeleteEntity(entity);
            setOpenDelete(true);
        } else if (entity === 'user' && operation === 'edit') {
            // Open modal to get accountId for editing
            setOpenEditEntityForm(true);
        } else if (entity === 'user' && operation === 'add') {
            setUserMode('add');
            setAccountId(''); // Clear accountId for add mode
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

    const handleCloseEditEntityForm = () => {
        setOpenEditEntityForm(false);
    };

    const handleEditEntitySuccess = (collectedAccountId) => {
        setAccountId(collectedAccountId); // Set the collected accountId
        setUserMode('edit'); // Set mode to edit
        setOpenAccountForm(true); // Open the user form for editing
        setOpenEditEntityForm(false); // Close the ID collection modal
    };

    const entities = ['user', 'customer', 'location', 'product'];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
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
                    mb: 3,
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

            {/* delete form modal */}
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
                    {deleteEntity && <DeleteEntityForm entity={deleteEntity} />}
                </Box>
            </Modal>

            {/* account form modal */}
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
                    {/* Display either CreateAccountForm or EditUserForm based on userMode */}
                    {userMode === 'add' ? (
                        <CreateAccountForm />
                    ) : (
                        <EditAccountForm accountId={accountId} />
                    )}
                </Box>
            </Modal>

            {/* edit entity ID collection modal */}
            <Modal
                open={openEditEntityForm}
                onClose={handleCloseEditEntityForm}
                aria-labelledby="edit-entity-modal"
                aria-describedby="edit-entity-description"
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
                    <EditEntityForm
                        entity="user"
                        onSuccess={handleEditEntitySuccess} // Pass success handler
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default AdminControls;
