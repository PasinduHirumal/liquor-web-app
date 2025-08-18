import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const ProductSourceAndPricingFields = ({ values, errors, touched, handleChange, handleBlur, loading }) => (
    <>
        <Row>
            <Col md={12}>
                <Form.Group className="mb-3">
                    <Form.Label>Product Source *</Form.Label>
                    <Form.Control
                        type="text"
                        name="superMarket_id"
                        value={values.superMarket_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.superMarket_id && !!errors.superMarket_id}
                        disabled={loading}
                        placeholder="Enter where the product is from"
                    />
                    <Form.Control.Feedback type="invalid">{errors.superMarket_id}</Form.Control.Feedback>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Cost Price *</Form.Label>
                    <Form.Control
                        type="number"
                        name="cost_price"
                        value={values.cost_price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="0.01"
                        isInvalid={touched.cost_price && !!errors.cost_price}
                        disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">{errors.cost_price}</Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Marked Price *</Form.Label>
                    <Form.Control
                        type="number"
                        name="marked_price"
                        value={values.marked_price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        step="0.01"
                        isInvalid={touched.marked_price && !!errors.marked_price}
                        disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">{errors.marked_price}</Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Discount (%) *</Form.Label>
                    <Form.Control
                        type="number"
                        name="discount_percentage"
                        value={values.discount_percentage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="0"
                        max="100"
                        step="0.01"
                        isInvalid={touched.discount_percentage && !!errors.discount_percentage}
                        disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">{errors.discount_percentage}</Form.Control.Feedback>
                </Form.Group>
            </Col>
        </Row>
    </>
);

export default ProductSourceAndPricingFields;
