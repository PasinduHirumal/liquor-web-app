import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { axiosInstance } from '../../../lib/axios';

const LiquorCreateForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        brand: '',
        alcohol_content: '',
        volume: '',
        cost_price: '',
        marked_price: '',
        discount_percentage: '',
        stock_quantity: '',
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
    });

    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/categories/getAll');
                setCategories(res.data.data || []);
            } catch (err) {
                toast.error('Failed to fetch categories');
                console.error('Category fetch error:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue =
            type === 'checkbox' ? checked :
                type === 'number' ? (value === '' ? '' : parseFloat(value)) :
                    value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file =>
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please upload at least one product image.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                images: images,
                add_quantity: 0,
                withdraw_quantity: 0
            };

            const res = await axiosInstance.post('/products/create', payload);

            toast.success('Product created successfully!');
            onSuccess(res.data.data);

            setFormData({
                name: '',
                description: '',
                category_id: '',
                brand: '',
                alcohol_content: '',
                volume: '',
                cost_price: '',
                marked_price: '',
                discount_percentage: '',
                stock_quantity: '',
                is_active: true,
                is_in_stock: true,
                is_liquor: true,
            });
            setImages([]);
        } catch (err) {
            const resData = err.response?.data;
            if (resData?.errors?.length) {
                resData.errors.forEach(e => {
                    toast.error(`${e.field}: ${e.message}`);
                });
            } else {
                toast.error(resData?.message || 'Failed to create product');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
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
                    disabled={loading}
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
                        disabled={loading}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        disabled={loading}
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
                        step="0.1"
                        disabled={loading}
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
                        step="1"
                        disabled={loading}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-4 mb-3">
                    <Form.Label>Cost Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="cost_price"
                        value={formData.cost_price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        disabled={loading}
                        required
                    />
                </Form.Group>
            </div>

            <div className="row">
                <Form.Group className="col-md-6 mb-3">
                    <Form.Label>Marked Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="marked_price"
                        value={formData.marked_price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        disabled={loading}
                        required
                    />
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control
                        type="number"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        disabled={loading}
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
                    step="1"
                    disabled={loading}
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
            </Form.Group>

            {images.length > 0 && (
                <div className="mb-3">
                    <Form.Label>Image Preview</Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="position-relative"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={img}
                                    alt={`preview-${index}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0"
                                    style={{
                                        padding: '0.2rem 0.5rem',
                                        fontSize: '0.8rem',
                                        lineHeight: 1,
                                        borderRadius: '0 0 0 6px',
                                    }}
                                    onClick={() => {
                                        setImages(images.filter((_, i) => i !== index));
                                    }}
                                    title="Remove"
                                >
                                    <FaTrash size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
