import React from "react";
import { Form, Col, Row } from "react-bootstrap";

const ProductCountryField = ({ values, errors, touched, handleChange, handleBlur, loading }) => (
    <Row>
        <Col md={12}>
            <Form.Group className="mb-3">
                <Form.Label>Country of Origin *</Form.Label>
                <Form.Control
                    type="text"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.country && !!errors.country}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
            </Form.Group>
        </Col>
    </Row>
);

export default ProductCountryField;
