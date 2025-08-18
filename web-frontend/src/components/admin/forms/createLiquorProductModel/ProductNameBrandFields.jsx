import React from "react";
import { Form, Col, Row } from "react-bootstrap";

const ProductNameBrandFields = ({ values, errors, touched, handleChange, handleBlur, loading }) => (
    <Row>
        <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && !!errors.name}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
        </Col>
        <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Brand *</Form.Label>
                <Form.Control
                    type="text"
                    name="brand"
                    value={values.brand}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.brand && !!errors.brand}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
            </Form.Group>
        </Col>
    </Row>
);

export default ProductNameBrandFields;
