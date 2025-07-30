import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import {
    Container, Form, Row, Col, Card, Spinner, Button, Alert, Image, FloatingLabel
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
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
    });

    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingMainImage, setExistingMainImage] = useState(null);
    const [newMainImageBase64, setNewMainImageBase64] = useState(null);
    const [newImagesBase64, setNewImagesBase64] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [priceUpdating, setPriceUpdating] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get("/categories/getAll");
                const liquorCategories = (res.data.data || []).filter(cat => cat.is_active && cat.is_liquor);
                setCategories(liquorCategories);
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
                    category_id: product.category_id?._id || product.category_id || "",
                    alcohol_content: product.alcohol_content || 0,
                    volume: product.volume || 0,
                    cost_price: product.cost_price || 0,
                    marked_price: product.marked_price || 0,
                    discount_percentage: product.discount_percentage || 0,
                    stock_quantity: product.stock_quantity || 0,
                    is_active: product.is_active ?? true,
                    is_in_stock: product.is_in_stock ?? true,
                    is_liquor: product.is_liquor ?? true,
                });

                setExistingMainImage(product.main_image || null);
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
        if (formData.cost_price < 0) newErrors.cost_price = "Cost price cannot be negative";
        if (formData.marked_price <= 0) newErrors.marked_price = "Price must be greater than 0";
        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            newErrors.discount_percentage = "Discount must be between 0-100%";
        }
        if (formData.stock_quantity < 0) newErrors.stock_quantity = "Stock cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (["cost_price", "marked_price", "discount_percentage",
            "stock_quantity", "alcohol_content", "volume",
            "add_quantity", "withdraw_quantity"].includes(name)) {
            newValue = parseFloat(newValue) || 0;
        }

        setFormData(prev => ({
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

    const handlePriceUpdate = async (e) => {
        e.preventDefault();

        if (formData.marked_price <= 0) {
            setErrors({ marked_price: "Price must be greater than 0" });
            return;
        }

        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            setErrors({ discount_percentage: "Discount must be between 0-100%" });
            return;
        }

        setPriceUpdating(true);
        try {
            const priceData = {
                cost_price: formData.cost_price,
                marked_price: formData.marked_price,
                discount_percentage: formData.discount_percentage
            };

            await axiosInstance.patch(`/products/update-price/${id}`, priceData);
            toast.success("Price updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Price update failed.");
        } finally {
            setPriceUpdating(false);
        }
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleMainImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64Image = await fileToBase64(file);
            setNewMainImageBase64(base64Image);
        } catch (error) {
            toast.error("Failed to read main image file.");
        }
    };

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

    const removeExistingMainImage = () => {
        setExistingMainImage(null);
    };

    const removeNewMainImage = () => {
        setNewMainImageBase64(null);
    };

    const removeExistingImage = (url) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const removeNewImage = (index) => {
        setNewImagesBase64((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInventoryUpdate = async (e) => {
        e.preventDefault();

        const { add_quantity, withdraw_quantity } = formData;
        const currentStock = formData.stock_quantity + (add_quantity || 0) - (withdraw_quantity || 0);

        if (currentStock < 0) {
            setErrors({ stock_quantity: "Insufficient stock for this operation" });
            return;
        }

        setUpdating(true);
        try {
            const inventoryData = {
                add_quantity: add_quantity || 0,
                withdraw_quantity: withdraw_quantity || 0
            };

            await axiosInstance.patch(`/products/update-quantity/${id}`, inventoryData);
            toast.success("Inventory updated successfully!");

            setFormData(prev => ({
                ...prev,
                stock_quantity: currentStock,
                add_quantity: 0,
                withdraw_quantity: 0
            }));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Inventory update failed.");
        } finally {
            setUpdating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!existingMainImage && !newMainImageBase64) {
            toast.error("Please upload a main image before updating.");
            return;
        }

        if (existingImages.length + newImagesBase64.length === 0) {
            toast.error("Please upload at least one additional image before updating.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setUpdating(true);

        try {
            const payload = {
                ...formData,
                main_image: newMainImageBase64 || existingMainImage,
                images: [...existingImages, ...newImagesBase64],
                marked_price: undefined,
                discount_percentage: undefined,
                cost_price: undefined,
                add_quantity: undefined,
                withdraw_quantity: undefined
            };

            await axiosInstance.patch(`/products/update/${id}`, payload);
            toast.success("Product updated successfully!");
            navigate(`/products/${id}`);
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

                                {/* Pricing Section */}
                                <Card className="mb-4">
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Pricing & Inventory</h5>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={handlePriceUpdate}
                                            disabled={priceUpdating}
                                        >
                                            {priceUpdating ? (
                                                <Spinner as="span" animation="border" size="sm" />
                                            ) : (
                                                "Update Price Only"
                                            )}
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <FloatingLabel controlId="cost_price" label="Cost Price ($)" className="mb-3">
                                                    <Form.Control
                                                        name="cost_price"
                                                        type="number"
                                                        value={formData.cost_price}
                                                        onChange={handleChange}
                                                        step="0.01"
                                                        min="0"
                                                        isInvalid={!!errors.cost_price}
                                                        placeholder="0.00"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.cost_price}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="marked_price" label="Marked Price ($)" className="mb-3">
                                                    <Form.Control
                                                        name="marked_price"
                                                        type="number"
                                                        value={formData.marked_price}
                                                        onChange={handleChange}
                                                        step="0.01"
                                                        min="0.01"
                                                        isInvalid={!!errors.marked_price}
                                                        placeholder="0.00"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.marked_price}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FloatingLabel controlId="discount_percentage" label="Discount (%)" className="mb-3">
                                                    <Form.Control
                                                        name="discount_percentage"
                                                        type="number"
                                                        value={formData.discount_percentage}
                                                        onChange={handleChange}
                                                        step="1"
                                                        min="0"
                                                        max="100"
                                                        isInvalid={!!errors.discount_percentage}
                                                        placeholder="0"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.discount_percentage}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Inventory Section */}
                                <Card className="mb-4">
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Manage Inventory</h5>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={handleInventoryUpdate}
                                            disabled={updating}
                                        >
                                            {updating ? (
                                                <Spinner as="span" animation="border" size="sm" />
                                            ) : (
                                                "Update Stock Only"
                                            )}
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <div className={`p-3 rounded ${formData.stock_quantity > 10 ? 'bg-success' : formData.stock_quantity > 0 ? 'bg-warning' : 'bg-danger'} text-white`}>
                                                        {formData.stock_quantity} units available
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="add_quantity" label="Add Quantity" className="mb-3">
                                                    <Form.Control
                                                        name="add_quantity"
                                                        type="number"
                                                        value={formData.add_quantity || 0}
                                                        onChange={handleChange}
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col md={6}>
                                                <FloatingLabel controlId="withdraw_quantity" label="Withdraw Quantity" className="mb-3">
                                                    <Form.Control
                                                        name="withdraw_quantity"
                                                        type="number"
                                                        value={formData.withdraw_quantity || 0}
                                                        onChange={handleChange}
                                                        min="0"
                                                        placeholder="0"
                                                    />
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
                                                        min="0"
                                                        max="100"
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

                                {/* Main Image Section */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h5 className="mb-0">Main Product Image</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="mb-3">
                                            <Form.Label>Current Main Image</Form.Label>
                                            {!existingMainImage && !newMainImageBase64 ? (
                                                <Alert variant="info">No main image uploaded yet</Alert>
                                            ) : (
                                                <div className="d-flex justify-content-center">
                                                    <div className="position-relative">
                                                        <Image
                                                            src={newMainImageBase64 || existingMainImage}
                                                            alt="main-product"
                                                            thumbnail
                                                            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                                            onError={(e) => (e.target.src = "/placeholder-bottle.jpg")}
                                                        />
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0 p-0 rounded-circle"
                                                            style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                                            onClick={newMainImageBase64 ? removeNewMainImage : removeExistingMainImage}
                                                            title="Remove image"
                                                        >
                                                            <XCircle size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <Form.Label>Upload New Main Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMainImageChange}
                                                className="d-none"
                                                id="mainImageUpload"
                                            />
                                            <Button
                                                variant="outline-primary"
                                                as="label"
                                                htmlFor="mainImageUpload"
                                                className="w-100 d-flex align-items-center justify-content-center gap-2"
                                            >
                                                <UploadCloud size={16} />
                                                Upload Main Image
                                            </Button>
                                            <Form.Text className="text-muted">
                                                Recommended ratio: 1:1 (square)
                                            </Form.Text>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* Additional Images Section */}
                                <Card>
                                    <Card.Header>
                                        <h5 className="mb-0">Additional Product Images</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="mb-3">
                                            <Form.Label>Current Images</Form.Label>
                                            {existingImages.length === 0 ? (
                                                <Alert variant="info">No additional images uploaded yet</Alert>
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
                                disabled={updating || priceUpdating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={updating || priceUpdating}
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