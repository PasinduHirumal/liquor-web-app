// components/ClearCategoriesButton.jsx
import { useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress
} from '@mui/material';
import { DeleteSweep as DeleteSweepIcon } from '@mui/icons-material';

const ClearCategoriesButton = ({ onClearComplete, disabled = false }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClearCategories = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete('/clear/categories');
            toast.success('All categories cleared successfully');

            // Call the callback to refresh the categories list
            if (onClearComplete) {
                onClearComplete();
            }

            handleCloseDialog();
        } catch (error) {
            console.error('Clear categories error:', error);
            toast.error(error.response?.data?.message || 'Failed to clear categories');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={handleOpenDialog}
                disabled={disabled}
            >
                Clear All Categories
            </Button>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ color: 'error.main' }}>
                    Clear All Categories
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to clear ALL categories? This action will permanently delete all categories and cannot be undone.
                        <br />
                        <br />
                        <strong>Warning:</strong> This will remove all category data from the system.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClearCategories}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <DeleteSweepIcon />}
                    >
                        {loading ? 'Clearing...' : 'Yes, Clear All'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ClearCategoriesButton;