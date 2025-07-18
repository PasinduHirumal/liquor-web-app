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
    Badge,
    FloatingLabel,
    Accordion
} from "react-bootstrap";
import { XCircle, UploadCloud, CheckCircle } from "react-feather";

const LiquorEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brand: "",
        category_id: "",
        alcohol_content: 0,
        volume: 0,
        price: 0,
        stock_quantity: 0,
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
    });

    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImagesBase64, setNewImagesBase64] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get("/categories/getAll");
                setCategories(res.data.data || []);
            } catch (err) {
                toast.error("Failed to load categories.");
                console.error(err);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/getProductById/${id}`);
                const product = res.data.data;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    brand: product.brand || "",
                    category_id: product.category_id?._id || "",
                    alcohol_content: product.alcohol_content || 0,
                    volume: product.volume || 0,
                    price: product.price || 0,
                    stock_quantity: product.stock_quantity || 0,
                    is_active: product.is_active ?? true,
                    is_in_stock: product.is_in_stock ?? true,
                    is_liquor: product.is_liquor ?? true,
                });

                setExistingImages(product.images || []);
            } catch (err) {
                toast.error("Failed to load product.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.category_id) newErrors.category_id = "Category is required";
        if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
        if (formData.stock_quantity < 0) newErrors.stock_quantity = "Stock cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (
            ["price", "stock_quantity", "alcohol_content", "volume"].includes(name)
        ) {
            newValue = parseFloat(newValue) || 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleNewImagesChange = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const base64Promises = files.map((file) => fileToBase64(file));
            const base64Images = await Promise.all(base64Promises);
            setNewImagesBase64((prev) => [...prev, ...base64Images]);
        } catch (error) {
            toast.error("Failed to read image files.");
        }
    };

    const removeExistingImage = (url) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const removeNewImage = (index) => {
        setNewImagesBase64((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (existingImages.length + newImagesBase64.length === 0) {
            toast.error("Please upload at least one image before updating.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setUpdating(true);

        try {
            const finalImages = [...existingImages, ...newImagesBase64];

            const payload = {
                ...formData,
                images: finalImages,
            };

            await axiosInstance.patch(`/products/update/${id}`, payload);
            toast.success("Product updated successfully!");
            navigate(`/liquor/${id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Update failed.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">Edit Liquor Product</h2>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            <Col md={8}>
                                {/* Basic Information Section */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5 className="mb-0">Basic Information</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                                            <Form.Control
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                isInvalid={!!errors.name}
                                                placeholder="Enter product name"
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
                                                placeholder="Enter product description"
                                            />
                                        </FloatingLabel>

                                        <FloatingLabel controlId="brand" label="Brand" className="mb-3">
                                            <Form.Control
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                placeholder="Enter brand name"
                                            />
                                        </FloatingLabel>

                                        <FloatingLabel controlId="category" label="Category" className="mb-3">
                                            <Form.Select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                required
                                                isInvalid={!!errors.category_id}
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat._id || cat.category_id} value={cat._id || cat.category_id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.category_id}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Card.Body>
                                </Card>

                                {/* Pricing & Inventory Section */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5 className="mb-0">Pricing & Inventory</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <FloatingLabel controlId="price" label="Price ($)" className="mb-3">
                                                    <Form.Control
                                                        name="price"
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        step="0.01"
                                                        isInvalid={!!errors.price}
                                                        placeholder="0.00"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.price}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="stock" label="Stock Quantity" className="mb-3">
                                                    <Form.Control
                                                        name="stock_quantity"
                                                        type="number"
                                                        value={formData.stock_quantity}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.stock_quantity}
                                                        placeholder="0"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.stock_quantity}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Product Specifications */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5 className="mb-0">Product Specifications</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <FloatingLabel controlId="alcohol" label="Alcohol Content (ABV%)" className="mb-3">
                                                    <Form.Control
                                                        name="alcohol_content"
                                                        type="number"
                                                        value={formData.alcohol_content}
                                                        onChange={handleChange}
                                                        step="0.1"
                                                        placeholder="0.0"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="volume" label="Volume (ml)" className="mb-3">
                                                    <Form.Control
                                                        name="volume"
                                                        type="number"
                                                        value={formData.volume}
                                                        onChange={handleChange}
                                                        placeholder="0"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                {/* Status & Images Section */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5 className="mb-0">Status</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Check
                                            type="switch"
                                            id="is_active"
                                            label="Active Product"
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

                                {/* Images Section */}
                                <Card>
                                    <Card.Header>
                                        <h5 className="mb-0">Product Images</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="mb-3">
                                            <Form.Label>Current Images</Form.Label>
                                            {existingImages.length === 0 ? (
                                                <Alert variant="info">No images uploaded yet</Alert>
                                            ) : (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {existingImages.map((url, idx) => (
                                                        <div key={idx} className="position-relative">
                                                            <Image
                                                                src={url}
                                                                alt={`existing-${idx}`}
                                                                thumbnail
                                                                style={{ width: 80, height: 80, objectFit: 'contain' }}
                                                                onError={(e) => (e.target.src = "/placeholder-bottle.jpg")}
                                                            />
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="position-absolute top-0 end-0 p-0 rounded-circle"
                                                                style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                                                onClick={() => removeExistingImage(url)}
                                                                title="Remove image"
                                                            >
                                                                <XCircle size={16} />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <Form.Label>Add New Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleNewImagesChange}
                                                className="d-none"
                                                id="imageUpload"
                                            />
                                            <Button
                                                variant="outline-primary"
                                                as="label"
                                                htmlFor="imageUpload"
                                                className="w-100 d-flex align-items-center justify-content-center gap-2"
                                            >
                                                <UploadCloud size={16} />
                                                Upload Images
                                            </Button>
                                            <Form.Text className="text-muted">
                                                Total Images ({(existingImages.length + newImagesBase64.length)})
                                            </Form.Text>
                                        </div>

                                        {newImagesBase64.length > 0 && (
                                            <div className="mt-2">
                                                <h6>New Images to Upload</h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {newImagesBase64.map((base64, idx) => (
                                                        <div key={idx} className="position-relative">
                                                            <Image
                                                                src={base64}
                                                                alt={`new-${idx}`}
                                                                thumbnail
                                                                style={{ width: 80, height: 80, objectFit: 'contain' }}
                                                            />
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="position-absolute top-0 end-0 p-0 rounded-circle"
                                                                style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                                                onClick={() => removeNewImage(idx)}
                                                                title="Remove image"
                                                            >
                                                                <XCircle size={16} />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={updating}
                            >
                                {updating ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} className="me-2" />
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

export default LiquorEditForm;