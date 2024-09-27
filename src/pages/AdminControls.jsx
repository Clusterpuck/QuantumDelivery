import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography, Modal, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import AdminControlsForm from '../components/AdminControlsForm';
import DeleteEntityForm from '../components/DeleteEntityForm';
import CreateAccountForm from '../components/CreateAccountForm';
import EditAccountForm from '../components/EditAccountForm'; 
import EditEntityForm from '../components/EditEntityForm'; 
import CreateProductForm from '../components/CreateProductForm'; 
import EditProductForm from '../components/EditProductForm'; 
import CheckPasswordForm from '../components/CheckPasswordForm';
import { getAccountDetails } from '../store/apiFunctions';
import {enableScroll} from '../assets/scroll.js';

const AdminControls = () => {
    const navigate = useNavigate();

    const [operations, setOperations] = useState({
        user: 'add',
        customer: 'add',
        location: 'add',
        product: 'add',
    });

    useEffect(() =>
    {
        enableScroll();
    });

    const [deleteEntity, setDeleteEntity] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAccountForm, setOpenAccountForm] = useState(false);
    const [openProductForm, setOpenProductForm] = useState(false);
    const [openEditEntityForm, setOpenEditEntityForm] = useState(false); 
    const [userMode, setUserMode] = useState('add');
    const [accountId, setAccountId] = useState(''); 
    const [productId, setProductId] = useState('');
    const [openPasswordModal, setOpenPasswordModal] = useState(false); 
    const [usernameForPasswordChange, setUsernameForPasswordChange] = useState('');
    const [accountStatus, setAccountStatus] = useState('');
    const [entityType, setEntityType] = useState('user'); // State for entity type

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
        } else if (operation === 'edit') {
            setEntityType(entity); 
            setOpenEditEntityForm(true);
        } else if (entity === 'user' && operation === 'add') {
            setUserMode('add');
            setAccountId('');
            setOpenAccountForm(true);
        } else if (entity === 'product' && operation === 'add') {
            setProductId('');
            setOpenProductForm(true);
        } else if (entity !== 'user' || 'product') {
            console.log(`Submitted operation for ${entity}:`, operation);
            navigate('/orders');
        }
    };

    const handleCloseDelete = () => setOpenDelete(false);
    const handleCloseAccountForm = () => setOpenAccountForm(false);
    const handleCloseProductForm = () => setOpenProductForm(false);
    const handleCloseEditEntityForm = () => setOpenEditEntityForm(false);

    const handleEditEntitySuccess = async (collectedEntityId) => {
        if (collectedEntityId) {
            if (entityType === 'user') {
                setAccountId(collectedEntityId);
                setUserMode('edit');
                setOpenAccountForm(true);
                const accountDetails = await getAccountDetails(collectedEntityId);
                if (accountDetails) {
                    setAccountStatus(accountDetails.status);
                }
                setOpenEditEntityForm(false);
            } else if (entityType === 'product') {
                setProductId(collectedEntityId);
                setOperations((prev) => ({ ...prev, product: 'edit' })); // Set product operation to 'edit'
                setOpenProductForm(true);
                setOpenEditEntityForm(false);
            } else {
                console.error('Unsupported entity type for editing.');
            }
        } else {
            console.error('No valid Entity ID provided.');
        }
    };
    

    const handleOpenPasswordModal = (username) => {
        setUsernameForPasswordChange(username);
        setOpenPasswordModal(true);
    };

    const handleClosePasswordModal = () => setOpenPasswordModal(false);

    const entities = ['user', 'customer', 'location', 'product'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Typography variant="h1" component="h1" sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', fontSize: '3rem', mb: 3 }}>
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

            {/* Delete entity modal */}
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="delete-entity-modal"
                aria-describedby="delete-entity-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400, width: '100%' }}>
                    {deleteEntity && <DeleteEntityForm entity={deleteEntity} />}
                </Box>
            </Modal>

            {/* Account form modal */}
            <Modal
                open={openAccountForm}
                onClose={handleCloseAccountForm}
                aria-labelledby="account-form-modal"
                aria-describedby="account-form-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 600, width: '100%' }}>
                    {userMode === 'add' ? <CreateAccountForm /> : <EditAccountForm accountId={accountId} handleOpenPasswordModal={handleOpenPasswordModal} accountStatus={accountStatus} />}
                </Box>
            </Modal>

            {/* Product creation form modal */}
            <Modal
                open={openProductForm}
                onClose={handleCloseProductForm}
                aria-labelledby="product-form-modal"
                aria-describedby="product-form-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 600, width: '100%' }}>
                    {operations.product === 'add' ? <CreateProductForm /> : <EditProductForm productId={productId} />}
                </Box>
            </Modal>

            {/* Edit entity ID collection modal */}
            <Modal
                open={openEditEntityForm}
                onClose={handleCloseEditEntityForm}
                aria-labelledby="edit-entity-modal"
                aria-describedby="edit-entity-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400, width: '100%' }}>
                    <EditEntityForm
                        entity={entityType} // Use dynamic entity type
                        onSuccess={handleEditEntitySuccess}
                    />
                </Box>
            </Modal>

            {/* Password modal */}
            <Modal
                open={openPasswordModal}
                onClose={handleClosePasswordModal}
                aria-labelledby="password-form-modal"
                aria-describedby="password-form-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400, width: '100%' }}>
                    <CheckPasswordForm username={usernameForPasswordChange} onClose={handleClosePasswordModal} />
                </Box>
            </Modal>
        </div>
    );
};

export default AdminControls;