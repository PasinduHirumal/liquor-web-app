import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import {
    Container, Typography, Paper, Box, Grid, TextField, FormControlLabel, Checkbox, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    DialogContentText, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, Avatar
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Cancel as CancelIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
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
    const [imageLoading, setImageLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [filters, setFilters] = useState({
        is_active: '',
        is_liquor: '',
    });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        is_liquor: false,
        icon: null
    });

    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.is_active !== '') params.is_active = filters.is_active;
            if (filters.is_liquor !== '') params.is_liquor = filters.is_liquor;

            const response = await axiosInstance.get('/categories/getAll', { params });
            setCategories(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!selectedImage) return null;
        
        setImageLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedImage);
            
            const response = await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data.url;
        } catch (error) {
            toast.error('Failed to upload image');
            return null;
        } finally {
            setImageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            // Upload image if selected
            let iconUrl = formData.icon;
            if (selectedImage) {
                iconUrl = await uploadImage();
                if (!iconUrl) return;
            }

            const payload = {
                ...formData,
                icon: iconUrl
            };

            if (editMode) {
                await axiosInstance.patch(`/categories/update/${currentCategoryId}`, payload);
                toast.success('Category updated successfully');
            } else {
                await axiosInstance.post('/categories/create', payload);
                toast.success('Category created successfully');
            }

            fetchCategories();
            resetForm();
            setOpenEditDialog(false);
            setOpenCreateDialog(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            is_liquor: category.is_liquor,
            icon: category.icon
        });
        setCurrentCategoryId(category.category_id);
        setEditMode(true);
        setImagePreview(category.icon || null);
        setSelectedImage(null);
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (id) => {
        setCategoryToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCategoryToDelete(null);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/categories/delete/${categoryToDelete}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        } finally {
            setLoading(false);
            handleCloseDeleteDialog();
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            is_active: true,
            is_liquor: false,
            icon: null
        });
        setSelectedImage(null);
        setImagePreview(null);
        setEditMode(false);
        setCurrentCategoryId(null);
    };

    const handleCloseEditDialog = () => {
        resetForm();
        setOpenEditDialog(false);
    };

    const handleOpenCreateDialog = () => {
        resetForm();
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        resetForm();
        setOpenCreateDialog(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Manage Categories
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateDialog}
                    >
                        Create Category
                    </Button>
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="filter-status-label">Filter By Status</InputLabel>
                        <Select
                            labelId="filter-status-label"
                            id="filter-status"
                            name="is_active"
                            value={filters.is_active}
                            label="Filter By Status"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="filter-type-label">Filter By Type</InputLabel>
                        <Select
                            labelId="filter-type-label"
                            id="filter-type"
                            name="is_liquor"
                            value={filters.is_liquor}
                            label="Filter By Type"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="true">Liquor</MenuItem>
                            <MenuItem value="false">Regular</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Category List */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Categories List
                    </Typography>
                    {loading && categories.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : categories.length === 0 ? (
                        <Typography className='text-center'>No categories found</Typography>
                    ) : (
                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: 400,
                                overflow: 'auto',
                                '& table': {
                                    minWidth: 650,
                                },
                                '& thead th': {
                                    position: 'sticky',
                                    top: 0,
                                    backgroundColor: '#f5f5f5',
                                    zIndex: 1,
                                },
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='fw-bold'>Icon</TableCell>
                                        <TableCell className='fw-bold'>Name</TableCell>
                                        <TableCell className='fw-bold'>Description</TableCell>
                                        <TableCell className='fw-bold'>Status</TableCell>
                                        <TableCell className='fw-bold'>Type</TableCell>
                                        <TableCell className='fw-bold' align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.category_id}>
                                            <TableCell>
                                                {category.icon ? (
                                                    <Avatar 
                                                        src={category.icon} 
                                                        alt={category.name}
                                                        sx={{ width: 40, height: 40 }}
                                                    />
                                                ) : (
                                                    <Avatar sx={{ width: 40, height: 40 }}>
                                                        {category.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                )}
                                            </TableCell>
                                            <TableCell>{category.name}</TableCell>
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
                                                    <IconButton onClick={() => handleEdit(category)} color="primary">
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

                {/* Create Dialog */}
                <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                    {imagePreview ? (
                                        <Avatar 
                                            src={imagePreview} 
                                            sx={{ width: 100, height: 100, mb: 2 }}
                                        />
                                    ) : (
                                        <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                                            <CloudUploadIcon fontSize="large" />
                                        </Avatar>
                                    )}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Icon
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
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
                                        />
                                    }
                                    label="Liquor Category"
                                    sx={{ ml: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCreateDialog} startIcon={<CancelIcon />} disabled={loading || imageLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            startIcon={<AddIcon />}
                            variant="contained"
                            disabled={loading || imageLoading}
                        >
                            {loading || imageLoading ? 'Processing...' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                    {imagePreview ? (
                                        <Avatar 
                                            src={imagePreview} 
                                            sx={{ width: 100, height: 100, mb: 2 }}
                                        />
                                    ) : (
                                        <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                                            <CloudUploadIcon fontSize="large" />
                                        </Avatar>
                                    )}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Change Icon
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
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
                                        />
                                    }
                                    label="Liquor Category"
                                    sx={{ ml: 2 }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditDialog} startIcon={<CancelIcon />} disabled={loading || imageLoading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            startIcon={<EditIcon />}
                            variant="contained"
                            disabled={loading || imageLoading}
                        >
                            {loading || imageLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this category? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default ManageCategory;