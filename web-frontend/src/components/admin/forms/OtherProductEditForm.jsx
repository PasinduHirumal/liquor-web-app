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
    FloatingLabel
} from "react-bootstrap";
import { XCircle, UploadCloud, CheckCircle, Image as ImageIcon } from "react-feather";

const OtherProductEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        product_from: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
        add_quantity: 0,
        withdraw_quantity: 0,
        is_active: true,
        is_in_stock: true,
        weight: 0,
        main_image: "",
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories first
                setCategoriesLoading(true);
                const categoriesRes = await axiosInstance.get("/categories/getAll");
                setCategories(categoriesRes.data.data.filter(cat => cat.is_active && !cat.is_liquor));

                // Then fetch product data
                const productRes = await axiosInstance.get(`/other-products/getOtherProductById/${id}`);
                const product = productRes.data.data;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    category_id: product.category_id?.id || product.category_id || "",
                    product_from: product.product_from || "",
                    cost_price: product.cost_price || 0,
                    marked_price: product.marked_price || 0,
                    discount_percentage: product.discount_percentage || 0,
                    stock_quantity: product.stock_quantity || 0,
                    add_quantity: 0,
                    withdraw_quantity: 0,
                    is_active: product.is_active ?? true,
                    is_in_stock: product.is_in_stock ?? true,
                    weight: product.weight || 0,
                    main_image: product.main_image || "",
                    images: product.images || []
                });
            } catch (error) {
                console.error(error);
                if (error.response?.status === 404) {
                    toast.error("Product not found");
                    navigate("/products");
                } else {
                    toast.error("Failed to load data");
                }
            } finally {
                setCategoriesLoading(false);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: ["cost_price", "marked_price", "discount_percentage", "stock_quantity", "weight", "add_quantity", "withdraw_quantity"].includes(name)
                ? parseFloat(newValue) || 0
                : newValue
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageUpload = async (e, isMainImage = false) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
            });

            if (isMainImage) {
                setFormData(prev => ({ ...prev, main_image: base64Image }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, base64Image]
                }));
            }
        } catch (error) {
            toast.error("Failed to process image");
        }
    };

    const removeImage = (index, isMainImage = false) => {
        if (isMainImage) {
            setFormData(prev => ({ ...prev, main_image: "" }));
        } else {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        }
    };

    const setAsMainImage = (image) => {
        // Remove from images array and set as main image
        setFormData(prev => ({
            ...prev,
            main_image: image,
            images: prev.images.filter(img => img !== image)
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            // General product update
            await axiosInstance.patch(`/other-products/update/${id}`, {
                name: formData.name,
                description: formData.description,
                category_id: formData.category_id,
                product_from: formData.product_from,
                is_active: formData.is_active,
                is_in_stock: formData.is_in_stock,
                weight: formData.weight,
                main_image: formData.main_image,
                images: formData.images
            });

            // Price update - let backend handle calculations
            await axiosInstance.patch(`/other-products/update-price/${id}`, {
                product_from: formData.product_from,
                cost_price: formData.cost_price,
                marked_price: formData.marked_price,
                discount_percentage: formData.discount_percentage
            });

            // Quantity update if needed
            if (formData.add_quantity > 0 || formData.withdraw_quantity > 0) {
                await axiosInstance.patch(`/other-products/update-quantity/${id}`, {
                    add_quantity: formData.add_quantity,
                    withdraw_quantity: formData.withdraw_quantity
                });
            }

            toast.success("Product updated successfully!");
            navigate('/other-product-list');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

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
                                {/* Basic Information */}
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

                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            {categoriesLoading ? (
                                                <div className="d-flex align-items-center text-muted">
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Loading categories...
                                                </div>
                                            ) : categoriesError ? (
                                                <Alert variant="warning">{categoriesError}</Alert>
                                            ) : (
                                                <Form.Select
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.category_id}
                                                    className="py-3"
                                                >
                                                    <option value="">-- Select Category --</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.category_id} value={cat.category_id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            )}
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>

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

                                {/* Pricing */}
                                <Card className="mb-4">
                                    <Card.Header><h5>Pricing</h5></Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={12}>
                                                <FloatingLabel controlId="productFrom" label="Product Source (e.g., Keels, Food City)" className="mb-3">
                                                    <Form.Control
                                                        type="text"
                                                        name="product_from"
                                                        value={formData.product_from}
                                                        onChange={handleChange}
                                                        placeholder="Where the product is from"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="costPrice" label="Cost Price (Rs)" className="mb-3">
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
                                                <FloatingLabel controlId="markedPrice" label="Marked Price (Rs)" className="mb-3">
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
                                            <Col md={12}>
                                                <FloatingLabel controlId="discountPercentage" label="Discount (%)" className="mb-3">
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
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.discount_percentage}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Inventory */}
                                <Card className="mb-4">
                                    <Card.Header><h5>Inventory Management</h5></Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={4}>
                                                <FloatingLabel controlId="currentStock" label="Current Stock" className="mb-3">
                                                    <Form.Control
                                                        type="number"
                                                        name="stock_quantity"
                                                        value={formData.stock_quantity}
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
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                {/* Status */}
                                <Card className="mb-4">
                                    <Card.Header><h5>Status</h5></Card.Header>
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
                                        />
                                    </Card.Body>
                                </Card>

                                {/* Main Image */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5>Main Image</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        {formData.main_image ? (
                                            <div className="position-relative mb-3">
                                                <Image
                                                    src={formData.main_image}
                                                    thumbnail
                                                    fluid
                                                    className="w-100"
                                                    style={{ maxHeight: "200px", objectFit: "contain" }}
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 m-1 rounded-circle"
                                                    onClick={() => removeImage(null, true)}
                                                >
                                                    <XCircle size={16} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 border rounded mb-3">
                                                <ImageIcon size={48} className="text-muted mb-2" />
                                                <p className="text-muted">No main image selected</p>
                                            </div>
                                        )}

                                        <Form.Group controlId="mainImageUpload">
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, true)}
                                                className="d-none"
                                                id="mainImageUpload"
                                            />
                                            <Button
                                                variant="outline-primary"
                                                as="label"
                                                htmlFor="mainImageUpload"
                                                className="w-100"
                                            >
                                                <UploadCloud className="me-2" />
                                                {formData.main_image ? "Change Main Image" : "Upload Main Image"}
                                            </Button>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>

                                {/* Gallery Images */}
                                <Card>
                                    <Card.Header>
                                        <h5>Gallery Images</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        {formData.images.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-2 mb-3">
                                                {formData.images.map((img, index) => (
                                                    <div key={index} className="position-relative">
                                                        <Image
                                                            src={img}
                                                            thumbnail
                                                            style={{ width: 80, height: 80, objectFit: 'cover' }}
                                                            onClick={() => setAsMainImage(img)}
                                                            className="cursor-pointer"
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
                                            <Alert variant="info" className="mb-3">No gallery images</Alert>
                                        )}

                                        <Form.Group controlId="galleryImageUpload">
                                            <Form.Control
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="d-none"
                                                id="galleryImageUpload"
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                as="label"
                                                htmlFor="galleryImageUpload"
                                                className="w-100"
                                            >
                                                <UploadCloud className="me-2" />
                                                Add Gallery Images
                                            </Button>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button variant="outline-secondary" onClick={() => navigate(-1)} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting}>
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