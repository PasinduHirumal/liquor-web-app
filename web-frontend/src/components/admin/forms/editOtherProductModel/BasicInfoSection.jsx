import React from "react";
import { Card, FloatingLabel, Form, Spinner, Alert } from "react-bootstrap";

const BasicInfoSection = ({
    formData,
    handleChange,
    errors,
    categories,
    categoriesLoading,
    categoriesError,
}) => {
    return (
        <Card className="mb-4">
            <Card.Header><h5>Basic Information</h5></Card.Header>
            <Card.Body>
                <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                    <Form.Control
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Product name"
                        autoComplete="off"
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
                                <option key={cat.category_id ?? cat.id} value={cat.category_id ?? cat.id}>
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
                        inputMode="decimal"
                    />
                </FloatingLabel>
            </Card.Body>
        </Card>
    );
};

export default BasicInfoSection;
