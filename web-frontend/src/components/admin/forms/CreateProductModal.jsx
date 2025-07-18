import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
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
        image: null,
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
                // Filter only active categories
                const activeCategories = (res.data.data || []).filter(cat => cat.is_active);
                setCategories(activeCategories);
            } catch (err) {
                setCategoriesError("Failed to fetch categories");
                console.error("Category fetch error:", err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [show]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "file"
                    ? files[0]
                    : name.includes("price") || name.includes("quantity") || name === "discount_percentage"
                        ? Number(value)
                        : value,
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

            await axiosInstance.post("/other-products/create", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onProductCreated();
            handleReset();
            onHide();
        } catch (err) {
            console.error("Create product error:", err);
            setError(err.response?.data?.message || "Failed to create product");
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
            image: null,
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
            className="mt-5 pb-5"
        >
            <Modal.Header closeButton>
                <Modal.Title>Create New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        {categoriesLoading ? (
                            <div>
                                <Spinner animation="border" size="sm" /> Loading categories...
                            </div>
                        ) : categoriesError ? (
                            <div className="text-danger">{categoriesError}</div>
                        ) : (
                            <Form.Select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                                disabled={isSubmitting || categories.length === 0}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Cost Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Marked Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="marked_price"
                            value={formData.marked_price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Discount Percentage</Form.Label>
                        <Form.Control
                            type="number"
                            name="discount_percentage"
                            value={formData.discount_percentage}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleInputChange}
                            required
                            min="0"
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateProductModal;
