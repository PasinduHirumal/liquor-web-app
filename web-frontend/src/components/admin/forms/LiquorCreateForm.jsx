import React, { useEffect, useState } from 'react';
import {
    Form,
    Button,
    Spinner,
    Row,
    Col,
    Card,
    Alert,
    Accordion,
    Badge,
    Tab,
    Tabs,
    Container
} from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { FaTrash, FaUpload, FaInfoCircle } from 'react-icons/fa';
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
    const [activeTab, setActiveTab] = useState('basic');

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        const readers = files.map(file =>
            new Promise((resolve, reject) => {
                if (!file.type.match('image.*')) {
                    reject(new Error('File is not an image'));
                    return;
                }

                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    reject(new Error('Image size exceeds 2MB limit'));
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
                setImages(prev => [...prev, ...base64Images]);
            })
            .catch((err) => {
                toast.error(err.message || 'Failed to read image files');
                console.error('Image read error:', err);
            });
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
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
        <Container fluid>
            <Card className="shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <Badge bg="primary" className="me-2">Liquor</Badge>
                            Create New Product
                        </h5>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-4"
                        fill
                    >
                        <Tab eventKey="basic" title="Basic Information">
                            <div className="mt-4">
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
                                                        <Form.Label>Product Name <span className="text-danger"></span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="name"
                                                            value={values.name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.name && !!errors.name}
                                                            disabled={loading}
                                                            placeholder="e.g. Premium Whiskey"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.name}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Brand <span className="text-danger"></span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="brand"
                                                            value={values.brand}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.brand && !!errors.brand}
                                                            disabled={loading}
                                                            placeholder="e.g. Johnnie Walker"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.brand}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Description <span className="text-danger"></span></Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={touched.description && !!errors.description}
                                                    disabled={loading}
                                                    placeholder="Describe the product features, taste, etc."
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.description}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Category <span className="text-danger"></span></Form.Label>
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
                                                        <Form.Label>Alcohol Content (%) <span className="text-danger"></span></Form.Label>
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
                                                            placeholder="e.g. 40"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.alcohol_content}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Volume (ml) <span className="text-danger"></span></Form.Label>
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
                                                            placeholder="e.g. 750"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.volume}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <div className="text-end mt-3">
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={() => setActiveTab('pricing')}
                                                >
                                                    Next: Pricing & Stock
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Tab>

                        <Tab eventKey="pricing" title="Pricing & Stock">
                            <div className="mt-4">
                                <Formik
                                    initialValues={{
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
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Cost Price <span className="text-danger"></span></Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">$</span>
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
                                                                placeholder="Wholesale price"
                                                            />
                                                        </div>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.cost_price}
                                                        </Form.Control.Feedback>
                                                        <Form.Text className="text-muted">
                                                            What you pay for the product
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Marked Price <span className="text-danger"></span></Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">$</span>
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
                                                                placeholder="Retail price"
                                                            />
                                                        </div>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.marked_price}
                                                        </Form.Control.Feedback>
                                                        <Form.Text className="text-muted">
                                                            Price before discount
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Discount (%) <span className="text-danger"></span></Form.Label>
                                                        <div className="input-group">
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
                                                                placeholder="0-100%"
                                                            />
                                                            <span className="input-group-text">%</span>
                                                        </div>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.discount_percentage}
                                                        </Form.Control.Feedback>
                                                        <Form.Text className="text-muted">
                                                            Percentage discount applied
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Stock Quantity <span className="text-danger"></span></Form.Label>
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
                                                            placeholder="Available units"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.stock_quantity}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Availability</Form.Label>
                                                        <div className="d-flex gap-4">
                                                            <Form.Check
                                                                type="switch"
                                                                id="is_active"
                                                                label="Active Product"
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

                                            <div className="d-flex justify-content-between mt-3">
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => setActiveTab('basic')}
                                                >
                                                    Back: Basic Information
                                                </Button>
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={() => setActiveTab('images')}
                                                >
                                                    Next: Product Images
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Tab>

                        <Tab eventKey="images" title="Product Images">
                            <div className="mt-4">
                                <Formik
                                    initialValues={{}}
                                    onSubmit={handleSubmit}
                                >
                                    {() => (
                                        <Form>
                                            <Form.Group className="mb-4">
                                                <Form.Label>
                                                    Product Images <span className="text-danger"></span>
                                                    <Badge bg="info" className="ms-2">
                                                        <FaInfoCircle className="me-1" />
                                                        Up to 5 images (2MB each)
                                                    </Badge>
                                                </Form.Label>

                                                <Card className="border-dashed">
                                                    <Card.Body className="text-center p-5">
                                                        <div className="d-flex flex-column align-items-center">
                                                            <FaUpload className="text-muted mb-3" size={24} />
                                                            <h5>Drag & drop images here or click to browse</h5>
                                                            <p className="text-muted mb-4">Supports JPG, PNG up to 2MB each</p>
                                                            <label htmlFor="product-images" className="btn btn-primary">
                                                                Select Images
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
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Form.Group>

                                            {images.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6>Selected Images ({images.length}/5)</h6>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => setImages([])}
                                                            disabled={loading}
                                                        >
                                                            <FaTrash className="me-1" />
                                                            Remove All
                                                        </Button>
                                                    </div>
                                                    <Row>
                                                        {images.map((img, index) => (
                                                            <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                                                                <ImagePreview
                                                                    src={img}
                                                                    onRemove={() => removeImage(index)}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            )}

                                            {images.length === 0 && (
                                                <Alert variant="warning" className="mb-4">
                                                    <FaInfoCircle className="me-2" />
                                                    Please upload at least one product image
                                                </Alert>
                                            )}

                                            <div className="d-flex justify-content-between mt-4">
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => setActiveTab('pricing')}
                                                >
                                                    Back: Pricing & Stock
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={loading || images.length === 0}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" />
                                                            Creating Product...
                                                        </>
                                                    ) : 'Create Product'}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LiquorCreateForm;