import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
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
        is_liquor: true
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers)
            .then((base64Images) => {
                setImages(base64Images);
            })
            .catch((err) => {
                console.error("Failed to read images:", err);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                images, // Send images to backend
            };

            const response = await axiosInstance.post('/products/create', payload);
            onSuccess(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
            console.error('Create product error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

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
                    <Form.Label>Category ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    />
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
                />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                </Button>
            </div>
        </Form>
    );
};

export default LiquorCreateForm;
