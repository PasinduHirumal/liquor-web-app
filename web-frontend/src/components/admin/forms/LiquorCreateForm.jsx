import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Row, Col, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { axiosInstance } from '../../../lib/axios';
import ImagePreview from '../../../common/ImagePreview';

// Validation schema
const productSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Description is required'),
    category_id: Yup.string().required('Category is required'),
    brand: Yup.string().required('Brand is required'),
    alcohol_content: Yup.number()
        .required('Alcohol content is required')
        .min(0, 'Must be at least 0%')
        .max(100, 'Cannot exceed 100%'),
    volume: Yup.number()
        .required('Volume is required')
        .min(1, 'Must be at least 1ml'),
    cost_price: Yup.number()
        .required('Cost price is required')
        .min(0, 'Cannot be negative'),
    marked_price: Yup.number()
        .required('Marked price is required')
        .min(0, 'Cannot be negative'),
    discount_percentage: Yup.number()
        .required('Discount percentage is required')
        .min(0, 'Cannot be negative')
        .max(100, 'Cannot exceed 100%'),
    stock_quantity: Yup.number()
        .required('Stock quantity is required')
        .min(0, 'Cannot be negative')
        .integer('Must be a whole number'),
});

const LiquorCreateForm = ({ onSuccess, onCancel }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/categories/getAll');
                const liquorCategories = (res.data.data || []).filter(cat => cat.is_active && cat.is_liquor);
                setCategories(liquorCategories);

            } catch (err) {
                toast.error('Failed to fetch categories');
                console.error('Category fetch error:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const readers = files.map(file =>
            new Promise((resolve, reject) => {
                if (!file.type.match('image.*')) {
                    reject(new Error('File is not an image'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            })
        );

        Promise.all(readers)
            .then((base64Images) => {
                setImages(prev => {
                    const updated = [...prev, ...base64Images];
                    if (!mainImage && updated.length > 0) {
                        setMainImage(updated[0]);
                    }
                    return updated;
                });
            })
            .catch((err) => {
                toast.error(err.message || 'Failed to read image files');
                console.error('Image read error:', err);
            });
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            if (prev[index] === mainImage) {
                setMainImage(updated[0] || null);
            }
            return updated;
        });
    };

    const handleSubmit = async (values) => {
        if (images.length === 0) {
            toast.error('Please upload at least one product image.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...values,
                images: images,
                main_image: mainImage,
                is_liquor: true,
                add_quantity: 0,
                withdraw_quantity: 0
            };

            const res = await axiosInstance.post('/products/create', payload);

            toast.success('Product created successfully!');
            onSuccess(res.data.data);
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
        <Card>
            <Card.Body>
                <Formik
                    initialValues={{
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
                    }}
                    validationSchema={productSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Product Name *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.name && !!errors.name}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Brand *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="brand"
                                            value={values.brand}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.brand && !!errors.brand}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.brand}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Description *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.description && !!errors.description}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.description}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category *</Form.Label>
                                        <Form.Select
                                            name="category_id"
                                            value={values.category_id}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.category_id && !!errors.category_id}
                                            disabled={loading}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.category_id} value={cat.category_id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.category_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Alcohol Content (%) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="alcohol_content"
                                            value={values.alcohol_content}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            isInvalid={touched.alcohol_content && !!errors.alcohol_content}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.alcohol_content}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Volume (ml) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="volume"
                                            value={values.volume}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min="1"
                                            step="1"
                                            isInvalid={touched.volume && !!errors.volume}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.volume}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cost Price *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cost_price"
                                            value={values.cost_price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min="0"
                                            step="0.01"
                                            isInvalid={touched.cost_price && !!errors.cost_price}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cost_price}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Marked Price *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="marked_price"
                                            value={values.marked_price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min="0"
                                            step="0.01"
                                            isInvalid={touched.marked_price && !!errors.marked_price}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.marked_price}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Discount (%) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="discount_percentage"
                                            value={values.discount_percentage}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            isInvalid={touched.discount_percentage && !!errors.discount_percentage}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.discount_percentage}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Stock Quantity *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="stock_quantity"
                                            value={values.stock_quantity}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min="0"
                                            step="1"
                                            isInvalid={touched.stock_quantity && !!errors.stock_quantity}
                                            disabled={loading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.stock_quantity}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3 d-flex align-items-end h-100">
                                        <div className="d-flex gap-4">
                                            <Form.Check
                                                type="switch"
                                                id="is_active"
                                                label="Active"
                                                name="is_active"
                                                checked={values.is_active}
                                                onChange={() => setFieldValue('is_active', !values.is_active)}
                                                disabled={loading}
                                            />
                                            <Form.Check
                                                type="switch"
                                                id="is_in_stock"
                                                label="In Stock"
                                                name="is_in_stock"
                                                checked={values.is_in_stock}
                                                onChange={() => setFieldValue('is_in_stock', !values.is_in_stock)}
                                                disabled={loading}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Product Images *</Form.Label>
                                <div className="border rounded p-3 text-center">
                                    <label htmlFor="product-images" className="btn btn-outline-primary">
                                        <FaUpload className="me-2" />
                                        {images.length > 0 ? 'Add More Images' : 'Upload Images'}
                                        <input
                                            id="product-images"
                                            type="file"
                                            name="images"
                                            onChange={handleImageChange}
                                            multiple
                                            accept="image/*"
                                            disabled={loading || images.length >= 5}
                                            className="d-none"
                                        />
                                    </label>
                                    <p className="small text-muted mt-2 mb-0">
                                        Upload images
                                    </p>
                                    {images.length > 0 && (
                                        <p className="small text-muted">
                                            {images.length} image(s) selected
                                        </p>
                                    )}
                                </div>
                            </Form.Group>

                            {images.length > 0 && (
                                <div className="mb-4">
                                    <Form.Label>Image Preview</Form.Label>
                                    <div className="d-flex flex-wrap gap-3">
                                        {images.map((img, index) => (
                                            <div key={index} className="position-relative">
                                                <ImagePreview
                                                    src={img}
                                                    onRemove={() => removeImage(index)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    name="mainImage"
                                                    label="Main"
                                                    checked={mainImage === img}
                                                    onChange={() => setMainImage(img)}
                                                    className="position-absolute top-0 start-0 m-2 bg-white px-2 rounded"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {images.length === 0 && touched.category_id && (
                                <Alert variant="warning" className="mb-4">
                                    Please upload at least one product image
                                </Alert>
                            )}

                            <div className="d-flex justify-content-end gap-3 mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => {
                                        onCancel();
                                        toast.info('Creation cancelled.');
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="d-flex align-items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Product'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    );
};

export default LiquorCreateForm;