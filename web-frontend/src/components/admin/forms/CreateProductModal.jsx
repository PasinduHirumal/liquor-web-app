import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";

const CreateProductModal = ({ show, onHide, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name.includes("price") || name.includes("quantity") ? Number(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await axiosInstance.post("/other-products/create", formData);
            onProductCreated(); 
            onHide();
            setFormData({
                name: "",
                description: "",
                category_id: "",
                cost_price: 0,
                marked_price: 0,
                discount_percentage: 0,
                stock_quantity: 0
            });
        } catch (err) {
            console.error("Create product error:", err);
            setError(err.response?.data?.message || "Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
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
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            required
                        />
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