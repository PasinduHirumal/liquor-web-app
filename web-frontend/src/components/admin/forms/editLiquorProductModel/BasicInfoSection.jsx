import React from "react";
import { Card, FloatingLabel, Form } from "react-bootstrap";

const BasicInfoSection = ({ formData, handleChange, categories, errors }) => {
    return (
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
                        style={{ height: "100px" }}
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

                <FloatingLabel controlId="country" label="Country" className="mb-3">
                    <Form.Control
                        name="country"
                        value={formData.country || ""}
                        onChange={handleChange}
                        placeholder="Enter country of origin"
                    />
                </FloatingLabel>
            </Card.Body>
        </Card>
    );
};

export default BasicInfoSection;
