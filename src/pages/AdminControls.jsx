import React, { useState } from 'react';
import { Paper, Grid, Typography, Modal, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import AdminControlsForm from '../components/AdminControlsForm';
import DeleteEntityForm from '../components/DeleteEntityForm'; // Import the DeleteEntityForm

const AdminControls = () => {
    const navigate = useNavigate();

    // Store the current operations state and entity for deletion
    const [operations, setOperations] = useState({
        user: 'add',
        customer: 'add',
        location: 'add',
        product: 'add'
    });
    const [deleteEntity, setDeleteEntity] = useState(null);  // State to store the entity requesting delete
    const [open, setOpen] = useState(false); // State to handle modal open/close

    const handleOperationChange = (entity) => (event) => {
        setOperations({
            ...operations,
            [entity]: event.target.value // Ensure 'delete' is the operation value for deletion
        });
    };

    const handleSubmit = (entity) => (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Ensure you're checking for both 'delete' and 'remove' if needed.
        if (operations[entity] === 'delete') {
            // Handle delete operation by opening modal
            setDeleteEntity(entity); // Store the entity requesting deletion
            setOpen(true); // Open the delete modal
        } else {
            // Handle other operations (e.g., add, edit)
            console.log(`Submitted operation for ${entity}:`, operations[entity]);
            // Only navigate if not deleting
            navigate('/addorder'); // TO DO: replace logic here
        }
    };

    const handleClose = () => {
        setOpen(false); // Close the modal
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

            {/* Delete Modal */}
            <Modal
                open={open}
                onClose={handleClose}
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
        </div>
    );
};

export default AdminControls;
