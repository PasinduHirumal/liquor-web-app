import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const CategoryAndVolumeFields = ({ categories, values, errors, touched, handleChange, handleBlur, loading }) => (
    <Row>
        <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                    name="category_id"
                    value={values.category_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.category_id && !!errors.category_id}
                    disabled={loading}
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
            </Form.Group>
        </Col>
        <Col md={3}>
            <Form.Group className="mb-3">
                <Form.Label>Alcohol Content (%) *</Form.Label>
                <Form.Control
                    type="number"
                    name="alcohol_content"
                    value={values.alcohol_content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    max="100"
                    step="0.1"
                    isInvalid={touched.alcohol_content && !!errors.alcohol_content}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">{errors.alcohol_content}</Form.Control.Feedback>
            </Form.Group>
        </Col>
        <Col md={3}>
            <Form.Group className="mb-3">
                <Form.Label>Volume (ml) *</Form.Label>
                <Form.Control
                    type="number"
                    name="volume"
                    value={values.volume}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                    step="1"
                    isInvalid={touched.volume && !!errors.volume}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">{errors.volume}</Form.Control.Feedback>
            </Form.Group>
        </Col>
    </Row>
);

export default CategoryAndVolumeFields;
