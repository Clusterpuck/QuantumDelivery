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
import CreateLocation from '../components/CreateLocation'; 
import CreateCustomer from '../components/CreateCustomer'; 
import EditProductForm from '../components/EditProductForm'; 
import EditLocationForm from '../components/EditLocationForm'; 
import EditCustomerForm from '../components/EditCustomerForm'; 
import CheckPasswordForm from '../components/CheckPasswordForm';
import { enableScroll } from '../assets/scroll.js';
import { getAccountDetails } from '../store/apiFunctions.js'

const AdminControls = () => {
    const navigate = useNavigate();

    const [deleteEntity, setDeleteEntity] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAccountForm, setOpenAccountForm] = useState(false);
    const [openProductForm, setOpenProductForm] = useState(false);
    const [openLocationForm, setOpenLocationForm] = useState(false);
    const [openCustomerForm, setOpenCustomerForm] = useState(false);
    const [openEditEntityForm, setOpenEditEntityForm] = useState(false); 
    const [userMode, setUserMode] = useState('add');
    const [accountId, setAccountId] = useState(''); 
    const [productId, setProductId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [customerId, setCustomerId] = useState(''); 
    const [openPasswordModal, setOpenPasswordModal] = useState(false); 
    const [usernameForPasswordChange, setUsernameForPasswordChange] = useState('');
    const [accountStatus, setAccountStatus] = useState('');
    const [entityType, setEntityType] = useState('user'); 

    useEffect(() => {
        enableScroll();
    }, []);

    const handleSubmit = (entity, action) => {
        if (action === 'delete') {
            setDeleteEntity(entity);
            setOpenDelete(true);
        } else if (action === 'edit') {
            setEntityType(entity); // entity should be the type of entity being edited
            setOpenEditEntityForm(true);
        } else if (entity === 'account' && action === 'add') {
            setUserMode('add');
            setAccountId('');
            setOpenAccountForm(true);
        } else if (entity === 'product' && action === 'add') {
            setProductId('');
            setOpenProductForm(true);
        } else if (entity === 'location' && action === 'add') {
            setLocationId('');
            setOpenLocationForm(true);
        } else if (entity === 'customer' && action === 'add') {
            setCustomerId('');
            setOpenCustomerForm(true);
        } else {
            console.log(`Submitted operation for ${entity}:`, action);
            navigate('/orders');
        }
    };

    const handleCloseDelete = () => setOpenDelete(false);
    const handleCloseAccountForm = () => setOpenAccountForm(false);
    const handleCloseProductForm = () => setOpenProductForm(false);
    const handleCloseLocationForm = () => setOpenLocationForm(false);
    const handleCloseCustomerForm = () => setOpenCustomerForm(false);
    const handleCloseEditEntityForm = () => setOpenEditEntityForm(false);

    const handleEditEntitySuccess = async (collectedEntityId) => {
        if (collectedEntityId) {
            if (entityType === 'account') {
                try {
                    const userData = await getAccountDetails(collectedEntityId); 
                    if (userData.status === 'inactive') {
                        console.error("Account is inactive and cannot be edited.");
                        setError("This account is inactive and cannot be edited."); // Display the error
                        return; // Prevent further action
                    }
                    setAccountId(collectedEntityId);
                    setUserMode('edit');
                    setOpenAccountForm(true);
                    setOpenEditEntityForm(false);
                } catch (err) {
                    console.error("Error fetching account data:", err);
                    setError("An error occurred while trying to fetch user data.");
                }
            } else if (entityType === 'product') {
                setProductId(collectedEntityId);
                setOpenProductForm(true);
                setOpenEditEntityForm(false);
            } else if (entityType === 'location') {
                setLocationId(collectedEntityId);
                setOpenLocationForm(true);
                setOpenEditEntityForm(false);
            } else if (entityType === 'customer') {
                setCustomerId(collectedEntityId);
                setOpenCustomerForm(true);
                setOpenEditEntityForm(false);
            } else {
                console.error("Unsupported entity type for editing.");
            }
        }
    };

    const handleOpenPasswordModal = (username) => {
        setUsernameForPasswordChange(username);
        setOpenPasswordModal(true);
    };

    const handleClosePasswordModal = () => setOpenPasswordModal(false);

    const entities = ['account', 'customer', 'location', 'product'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <Typography variant="h3" component="h3" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SettingsIcon sx={{ fontSize: 50 }} />
                Admin Controls
            </Typography>

            <Paper elevation={3} sx={{ padding: 6, maxWidth: 1000, width: '100%' }}>
                <Grid container spacing={2} justifyContent="center">
                    {entities.map((entity) => (
                        <AdminControlsForm
                            key={entity}
                            entity={entity}
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
                    { productId ? <EditProductForm productId={productId} /> : <CreateProductForm /> }
                </Box>
            </Modal>

            {/* Location edit form modal */}
            <Modal
                open={openLocationForm}
                onClose={handleCloseLocationForm}
                aria-labelledby="location-form-modal"
                aria-describedby="location-form-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 600, width: '100%' }}>
                    {locationId ? <EditLocationForm locationId={locationId} /> : <CreateLocation />}
                </Box>
            </Modal>

            {/* Customer edit form modal */}
            <Modal
                open={openCustomerForm}
                onClose={handleCloseCustomerForm}
                aria-labelledby="customer-form-modal"
                aria-describedby="customer-form-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 600, width: '100%' }}>
                    {customerId ? <EditCustomerForm customerId={customerId} /> : <CreateCustomer />}
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
                        entity={entityType} 
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
