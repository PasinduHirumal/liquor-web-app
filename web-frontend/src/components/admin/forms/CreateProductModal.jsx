import React, { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Row,
    Col,
    Alert,
    FloatingLabel,
    Image,
    Card
} from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

const CreateProductModal = ({ show, onHide, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
        weight: 0,
        is_active: true,
        is_in_stock: true,
    });

    const [mainImage, setMainImage] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Handle main image upload and preview
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setMainImage({ file, preview: reader.result });
            }
        };
        reader.readAsDataURL(file);
    };

    const removeMainImage = () => {
        setMainImage(null);
    };

    // Handle multiple images upload and previews
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreviews(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        file,
                        preview: reader.result
                    }]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (id) => {
        setImagePreviews(prev => prev.filter(img => img.id !== id));
    };

    useEffect(() => {
        if (!show) return;

        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError(null);
            try {
                const res = await axiosInstance.get("/categories/getAll");
                const activeCategories = (res.data.data || []).filter(cat => cat.is_active && !cat.is_liquor);
                setCategories(activeCategories);
            } catch (err) {
                setCategoriesError("Failed to fetch categories. Please try again.");
                console.error("Category fetch error:", err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [show]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Convert mainImage to base64 string
            const mainImageBase64 = mainImage ? await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(mainImage.file);
                reader.onload = () => resolve(reader.result);
            }) : null;

            // Convert all other images to base64 strings
            const base64Images = await Promise.all(
                imagePreviews.map(img => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(img.file);
                        reader.onload = () => resolve(reader.result);
                    });
                })
            );

            const payload = {
                ...formData,
                main_image: mainImageBase64,
                images: base64Images,
            };

            await axiosInstance.post("/other-products/create", payload);

            onProductCreated();
            handleReset();
            onHide();
        } catch (err) {
            console.error("Create product error:", err);
            setError(err.response?.data?.message || "Failed to create product. Please check your inputs and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: "",
            description: "",
            category_id: "",
            cost_price: 0,
            marked_price: 0,
            discount_percentage: 0,
            stock_quantity: 0,
            weight: 0,
            is_active: true,
            is_in_stock: true,
        });
        setMainImage(null);
        setImagePreviews([]);
        setError(null);
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                handleReset();
                onHide();
            }}
            backdrop="static"
            keyboard={false}
            size="lg"
            centered
            className="product-modal mt-5 pb-5"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="h4 fw-bold">Create New Product</Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-1">
                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={6}>
                            {/* Basic info */}
                            <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Product Name"
                                />
                            </FloatingLabel>

                            <FloatingLabel controlId="description" label="Description" className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                    style={{ height: '120px' }}
                                    placeholder="Description"
                                />
                            </FloatingLabel>

                            {/* Category */}
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
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting || categories.length === 0}
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
                            </Form.Group>

                            {/* Main Image Upload */}
                            <Form.Group controlId="main_image" className="mb-3">
                                <Form.Label>Main Product Image</Form.Label>
                                <div className="border rounded p-3 text-center mb-3">
                                    {mainImage ? (
                                        <div className="position-relative d-inline-block">
                                            <Image
                                                src={mainImage.preview}
                                                alt="Main Image Preview"
                                                thumbnail
                                                style={{ maxHeight: '200px', maxWidth: '100%' }}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0 p-0 rounded-circle"
                                                style={{ width: '24px', height: '24px' }}
                                                onClick={removeMainImage}
                                                disabled={isSubmitting}
                                            >
                                                <FiX size={16} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <label
                                                htmlFor="main-image-upload"
                                                className="d-flex flex-column align-items-center justify-content-center"
                                                style={{ cursor: 'pointer', minHeight: '100px' }}
                                            >
                                                <FiUpload size={24} className="mb-2" />
                                                <span>Click to upload main image</span>
                                                <small className="text-muted">(JPEG, PNG, etc.)</small>
                                            </label>
                                            <Form.Control
                                                id="main-image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMainImageChange}
                                                disabled={isSubmitting}
                                                className="d-none"
                                            />
                                        </>
                                    )}
                                </div>
                            </Form.Group>

                            {/* Multiple Images Upload */}
                            <Form.Group controlId="images" className="mb-3">
                                <Form.Label>Other Product Images</Form.Label>
                                <div className="border rounded p-3 text-center mb-3">
                                    <label
                                        htmlFor="product-images-upload"
                                        className="d-flex flex-column align-items-center justify-content-center"
                                        style={{ cursor: 'pointer', minHeight: '100px' }}
                                    >
                                        <FiUpload size={24} className="mb-2" />
                                        <span>Click to upload images</span>
                                        <small className="text-muted">(JPEG, PNG, etc.)</small>
                                    </label>
                                    <Form.Control
                                        id="product-images-upload"
                                        type="file"
                                        name="images"
                                        onChange={handleImageChange}
                                        multiple
                                        accept="image/*"
                                        disabled={isSubmitting}
                                        className="d-none"
                                    />
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="mb-3">
                                        <h6 className="mb-2">Selected Images ({imagePreviews.length})</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {imagePreviews.map((img) => (
                                                <div key={img.id} className="position-relative" style={{ width: '80px', height: '80px' }}>
                                                    <Image
                                                        src={img.preview}
                                                        alt="Preview"
                                                        thumbnail
                                                        className="h-100 w-100 object-fit-cover"
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="position-absolute top-0 end-0 p-0 rounded-circle"
                                                        style={{ width: '20px', height: '20px' }}
                                                        onClick={() => removeImage(img.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FiX size={12} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            {/* Pricing */}
                            <Card className="mb-3">
                                <Card.Body>
                                    <h6 className="mb-3">Pricing Information</h6>
                                    <Row className="g-2 mb-3">
                                        <Col>
                                            <FloatingLabel controlId="cost_price" label="Cost Price">
                                                <Form.Control
                                                    type="number"
                                                    name="cost_price"
                                                    value={formData.cost_price}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    disabled={isSubmitting}
                                                    placeholder="0.00"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col>
                                            <FloatingLabel controlId="marked_price" label="Marked Price">
                                                <Form.Control
                                                    type="number"
                                                    name="marked_price"
                                                    value={formData.marked_price}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    disabled={isSubmitting}
                                                    placeholder="0.00"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="g-2 mb-3">
                                        <Col>
                                            <FloatingLabel controlId="discount_percentage" label="Discount %">
                                                <Form.Control
                                                    type="number"
                                                    name="discount_percentage"
                                                    value={formData.discount_percentage}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    max="100"
                                                    disabled={isSubmitting}
                                                    placeholder="0"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col>
                                            <FloatingLabel controlId="stock_quantity" label="Stock Quantity">
                                                <Form.Control
                                                    type="number"
                                                    name="stock_quantity"
                                                    value={formData.stock_quantity}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    disabled={isSubmitting}
                                                    placeholder="0"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Additional Info */}
                            <Card className="mb-3">
                                <Card.Body>
                                    <h6 className="mb-3">Additional Information</h6>
                                    <Row className="g-2 mb-3">
                                        <Col>
                                            <FloatingLabel controlId="weight" label="Weight (optional)">
                                                <Form.Control
                                                    type="number"
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    step="0.01"
                                                    disabled={isSubmitting}
                                                    placeholder="0"
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <div className="d-flex gap-4">
                                        <Form.Check
                                            type="switch"
                                            id="is_active"
                                            name="is_active"
                                            label="Active Product"
                                            className="mb-2"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                        />
                                        <Form.Check
                                            type="switch"
                                            id="is_in_stock"
                                            name="is_in_stock"
                                            label="In Stock"
                                            className="mb-2"
                                            checked={formData.is_in_stock}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                handleReset();
                                onHide();
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4"
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Creating...
                                </>
                            ) : "Create Product"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateProductModal;
