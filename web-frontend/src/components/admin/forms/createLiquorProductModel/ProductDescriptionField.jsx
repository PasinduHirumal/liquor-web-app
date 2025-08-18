import React from "react";
import { Form } from "react-bootstrap";

const ProductDescriptionField = ({ values, errors, touched, handleChange, handleBlur, loading }) => (
    <Form.Group className="mb-3">
        <Form.Label>Description *</Form.Label>
        <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.description && !!errors.description}
            disabled={loading}
        />
        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
    </Form.Group>
);

export default ProductDescriptionField;
