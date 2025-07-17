import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';

const LiquorCreateForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        brand: '',
        alcohol_content: 0,
        volume: 0,
        price: 0,
        stock_quantity: 0,
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
    });

    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/categories/getAll');
                setCategories(res.data.data || []);
            } catch (err) {
                toast.error('Failed to fetch categories');
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue;
        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'number') {
            newValue = value === '' ? '' : parseFloat(value);
        } else {
            newValue = value;
        }
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    // Handle image file input and convert to base64
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(
            (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        );

        Promise.all(readers)
            .then((base64Images) => setImages(base64Images))
            .catch((err) => {
                toast.error('Failed to read image files');
                console.error('Image read error:', err);
            });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors([]);

        try {
            const payload = {
                ...formData,
                images,
            };

            const response = await axiosInstance.post('/products/create', payload);
            toast.success('Product created successfully!');
            onSuccess(response.data.data);

            // Reset form
            setFormData({
                name: '',
                description: '',
                category_id: '',
                brand: '',
                alcohol_content: 0,
                volume: 0,
                price: 0,
                stock_quantity: 0,
                is_active: true,
                is_in_stock: true,
                is_liquor: true,
            });
            setImages([]);
        } catch (err) {
            const resData = err.response?.data;
            if (resData?.errors?.length) {
                setValidationErrors(resData.errors);
                toast.warn('Please fix validation errors.');
            } else {
                const msg = resData?.message || 'Failed to create product';
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Validation errors */}
            {validationErrors.length > 0 && (
                <div className="alert alert-warning" role="alert">
                    <strong>Validation Errors:</strong>
                    <ul className="mb-0">
                        {validationErrors.map((e, idx) => (
                            <li key={idx}>
                                {e.field}: {e.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <div className="row">
                <Form.Group className="col-md-6 mb-3">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </div>

            <div className="row">
                <Form.Group className="col-md-4 mb-3">
                    <Form.Label>Alcohol Content (%)</Form.Label>
                    <Form.Control
                        type="number"
                        name="alcohol_content"
                        value={formData.alcohol_content}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-4 mb-3">
                    <Form.Label>Volume (ml)</Form.Label>
                    <Form.Control
                        type="number"
                        name="volume"
                        value={formData.volume}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-4 mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </Form.Group>
            </div>

            <Form.Group className="mb-3">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Product Images</Form.Label>
                <Form.Control
                    type="file"
                    name="images"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                    disabled={loading}
                />
            </Form.Group>

            <Form.Group className="mb-3 d-flex gap-3">
                <Form.Check
                    type="checkbox"
                    label="Active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={loading}
                />
                <Form.Check
                    type="checkbox"
                    label="In Stock"
                    name="is_in_stock"
                    checked={formData.is_in_stock}
                    onChange={handleChange}
                    disabled={loading}
                />
                <Form.Check
                    type="checkbox"
                    label="Is Liquor"
                    name="is_liquor"
                    checked={formData.is_liquor}
                    onChange={handleChange}
                    disabled={loading}
                />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button
                    variant="secondary"
                    onClick={() => {
                        onCancel();
                        toast.info('Creation cancelled.');
                    }}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Create Product'}
                </Button>
            </div>
        </Form>
    );
};

export default LiquorCreateForm;
