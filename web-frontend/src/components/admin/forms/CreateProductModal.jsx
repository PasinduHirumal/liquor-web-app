import React, { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Row,
    Col,
    Alert,
    FloatingLabel
} from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";

const CreateProductModal = ({ show, onHide, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
    });

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch categories when modal opens
    useEffect(() => {
        if (!show) return;

        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError(null);
            try {
                const res = await axiosInstance.get("/categories/getAll");
                const activeCategories = (res.data.data || []).filter(cat => cat.is_active);
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
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "number"
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    data.append(key, value);
                }
            });

            await axiosInstance.post("/other-products/create", data);

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
        });
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
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="h4 fw-bold">Create New Product</Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-1">
                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                        <Col md={6}>
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
                                                {cat.name} {!cat.is_active && "(Inactive)"}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
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
