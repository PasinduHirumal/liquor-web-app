import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    IconButton,
    Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        is_liquor: false
    });
    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/categories/getAll');
            setCategories(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
            console.error('Fetch categories error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editMode) {
                // Update existing category
                await axiosInstance.patch(`/categories/update/${currentCategoryId}`, formData);
                toast.success('Category updated successfully');
            } else {
                // Create new category
                await axiosInstance.post('/categories/create', formData);
                toast.success('Category created successfully');
            }

            fetchCategories();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
            console.error('Category operation error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Edit category
    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            is_liquor: category.is_liquor
        });
        setCurrentCategoryId(category.category_id);
        setEditMode(true);
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (id) => {
        setCategoryToDelete(id);
        setOpenDeleteDialog(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCategoryToDelete(null);
    };

    // Delete category
    const handleDelete = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/categories/delete/${categoryToDelete}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
            console.error('Delete category error:', error);
        } finally {
            setLoading(false);
            handleCloseDeleteDialog();
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            is_active: true,
            is_liquor: false
        });
        setEditMode(false);
        setCurrentCategoryId(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    Manage Categories
                </Typography>

                {/* Category Form */}
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
                        {editMode ? 'Edit Category' : 'Create New Category'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            color="primary"
                                        />
                                    }
                                    label="Active"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_liquor"
                                            checked={formData.is_liquor}
                                            onChange={handleInputChange}
                                            color="primary"
                                        />
                                    }
                                    label="Liquor Category"
                                    sx={{ ml: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                {editMode && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={editMode ? <EditIcon /> : <AddIcon />}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : editMode ? 'Update' : 'Create'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                {/* Categories List */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
                        Categories List
                    </Typography>
                    {loading && categories.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : categories.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            No categories found
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.category_id}>
                                            <TableCell>
                                                <Typography fontWeight="medium">{category.name}</Typography>
                                            </TableCell>
                                            <TableCell>{category.description || '-'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={category.is_active ? 'Active' : 'Inactive'}
                                                    color={category.is_active ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={category.is_liquor ? 'Liquor' : 'Regular'}
                                                    color={category.is_liquor ? 'primary' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        onClick={() => handleEdit(category)}
                                                        color="primary"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => handleDeleteClick(category.category_id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default ManageCategory;