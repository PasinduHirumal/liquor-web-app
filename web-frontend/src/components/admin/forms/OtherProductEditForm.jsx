import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import {
    Container,
    Form,
    Row,
    Col,
    Card,
    Spinner,
    Button,
    Alert,
    Image,
    FloatingLabel,
    InputGroup
} from "react-bootstrap";
import { XCircle, UploadCloud, CheckCircle } from "react-feather";

const OtherProductEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        cost_price: 0,
        marked_price: 0,
        selling_price: 0,
        discount_percentage: 0,
        discount_amount: 0,
        stock_quantity: 0,
        add_quantity: 0,
        withdraw_quantity: 0,
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
        weight: 0,
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch product and categories data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productRes] = await Promise.all([
                    axiosInstance.get("/categories/getAll"),
                    axiosInstance.get(`/other-products/getOtherProductById/${id}`)
                ]);

                const activeCategories = (categoriesRes.data.data || []).filter(cat => cat.is_active);
                setCategories(activeCategories);

                const product = productRes.data.data;
                const productCategoryId = product.category_id?._id || product.category_id || "";

                // Check if category still exists and is active
                const isValidCategory = activeCategories.some(cat => cat._id === productCategoryId);
                const fallbackCategory = isValidCategory ? productCategoryId : "";

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    category_id: fallbackCategory,
                    cost_price: product.cost_price || 0,
                    marked_price: product.marked_price || 0,
                    selling_price: product.selling_price || 0,
                    discount_percentage: product.discount_percentage || 0,
                    discount_amount: product.discount_amount || 0,
                    stock_quantity: product.stock_quantity || 0,
                    add_quantity: 0,
                    withdraw_quantity: 0,
                    is_active: product.is_active ?? true,
                    is_in_stock: product.is_in_stock ?? true,
                    is_liquor: product.is_liquor ?? true,
                    weight: product.weight || 0,
                    images: product.images || []
                });
            } catch (error) {
                toast.error("Failed to load product or category data.");
                console.error(error);
                navigate("/products");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);


    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: ["cost_price", "marked_price", "discount_percentage", "stock_quantity", "weight", "add_quantity", "withdraw_quantity"].includes(name)
                ? parseFloat(newValue) || 0
                : newValue
        }));

        // Recalculate prices when marked price or discount changes
        if (name === "marked_price" || name === "discount_percentage") {
            const discountAmount = formData.marked_price * (formData.discount_percentage / 100);
            const sellingPrice = formData.marked_price - discountAmount;

            setFormData(prev => ({
                ...prev,
                discount_amount: discountAmount,
                selling_price: sellingPrice
            }));
        }

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle image uploads
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 10) {
            toast.error("Maximum 10 images allowed");
            return;
        }

        try {
            const base64Promises = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                });
            });

            const newImages = await Promise.all(base64Promises);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (error) {
            toast.error("Failed to process images");
        }
    };

    // Remove an image
    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.category_id) newErrors.category_id = "Category is required";
        if (formData.cost_price <= 0) newErrors.cost_price = "Cost price must be positive";
        if (formData.marked_price <= 0) newErrors.marked_price = "Marked price must be positive";
        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            newErrors.discount_percentage = "Discount must be between 0-100%";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            // Prepare payload based on what's being updated
            const payload = {
                ...formData,
                // Remove calculated fields that backend will handle
                selling_price: undefined,
                discount_amount: undefined
            };

            await axiosInstance.patch(`/other-products/update/${id}`, payload);
            toast.success("Product updated successfully!");
            navigate(`/products/${id}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">Edit Product</h2>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={8}>
                                {/* Basic Information Section */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5>Basic Information</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                                            <Form.Control
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                isInvalid={!!errors.name}
                                                placeholder="Product name"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>

                                        <FloatingLabel controlId="description" label="Description" className="mb-3">
                                            <Form.Control
                                                as="textarea"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                style={{ height: '100px' }}
                                                placeholder="Product description"
                                            />
                                        </FloatingLabel>

                                        <FloatingLabel controlId="category" label="Category" className="mb-3">
                                            <Form.Select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                isInvalid={!!errors.category_id}
                                            >
                                                <option value="">Select category</option>
                                                {categories.map(category => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category_id}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>

                                        <FloatingLabel controlId="weight" label="Weight (grams)" className="mb-3">
                                            <Form.Control
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="Product weight"
                                            />
                                        </FloatingLabel>
                                    </Card.Body>
                                </Card>

                                {/* Pricing Section */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5>Pricing</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <FloatingLabel controlId="costPrice" label="Cost Price ($)" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="cost_price"
                                                        value={formData.cost_price}
                                                        onChange={handleChange}
                                                        min="0"
                                                        step="0.01"
                                                        isInvalid={!!errors.cost_price}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.cost_price}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="markedPrice" label="Marked Price ($)" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="marked_price"
                                                        value={formData.marked_price}
                                                        onChange={handleChange}
                                                        min="0"
                                                        step="0.01"
                                                        isInvalid={!!errors.marked_price}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.marked_price}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <FloatingLabel controlId="discountPercentage" label="Discount (%)" className="mb-3">
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="number"
                                                            name="discount_percentage"
                                                            value={formData.discount_percentage}
                                                            onChange={handleChange}
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            isInvalid={!!errors.discount_percentage}
                                                        />
                                                        <InputGroup.Text>%</InputGroup.Text>
                                                    </InputGroup>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.discount_percentage}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="sellingPrice" label="Selling Price ($)" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="selling_price"
                                                        value={formData.selling_price.toFixed(2)}
                                                        readOnly
                                                        plaintext
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Inventory Management */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5>Inventory Management</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={4}>
                                                <FloatingLabel controlId="currentStock" label="Current Stock" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="stock_quantity"
                                                        value={formData.stock_quantity}
                                                        onChange={handleChange}
                                                        min="0"
                                                        readOnly
                                                        plaintext
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={4}>
                                                <FloatingLabel controlId="addQuantity" label="Add Quantity" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="add_quantity"
                                                        value={formData.add_quantity}
                                                        onChange={handleChange}
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={4}>
                                                <FloatingLabel controlId="withdrawQuantity" label="Withdraw Quantity" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="withdraw_quantity"
                                                        value={formData.withdraw_quantity}
                                                        onChange={handleChange}
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                {/* Status Toggles */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5>Status</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Check
                                            type="switch"
                                            id="is_active"
                                            label="Active"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="mb-3"
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="is_in_stock"
                                            label="In Stock"
                                            name="is_in_stock"
                                            checked={formData.is_in_stock}
                                            onChange={handleChange}
                                            className="mb-3"
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="is_liquor"
                                            label="Liquor Product"
                                            name="is_liquor"
                                            checked={formData.is_liquor}
                                            onChange={handleChange}
                                        />
                                    </Card.Body>
                                </Card>

                                {/* Images Section */}
                                <Card>
                                    <Card.Header>
                                        <h5>Product Images</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        {errors.images && (
                                            <Alert variant="danger" className="mb-3">
                                                {errors.images}
                                            </Alert>
                                        )}

                                        {formData.images.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-2 mb-3">
                                                {formData.images.map((img, index) => (
                                                    <div key={index} className="position-relative">
                                                        <Image
                                                            src={img}
                                                            thumbnail
                                                            style={{ width: 80, height: 80, objectFit: 'cover' }}
                                                            onError={(e) => e.target.src = '/placeholder-image.png'}
                                                        />
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0 p-0 rounded-circle"
                                                            style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <XCircle size={16} />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Alert variant="info" className="mb-3">
                                                No images uploaded
                                            </Alert>
                                        )}

                                        <Form.Group controlId="imageUpload" className="mb-3">
                                            <Form.Control
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="d-none"
                                                id="productImageUpload"
                                            />
                                            <Button
                                                variant="outline-primary"
                                                as="label"
                                                htmlFor="productImageUpload"
                                                className="w-100"
                                            >
                                                <UploadCloud className="me-2" />
                                                Select Images
                                            </Button>
                                            <Form.Text>
                                                {formData.images.length} image(s) selected
                                            </Form.Text>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="me-2" size={16} />
                                        Update Product
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OtherProductEditForm;