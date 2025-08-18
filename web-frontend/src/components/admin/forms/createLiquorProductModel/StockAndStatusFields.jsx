import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const StockAndStatusFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, loading }) => (
    <Row>
        <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Stock Quantity *</Form.Label>
                <Form.Control
                    type="number"
                    name="stock_quantity"
                    value={values.stock_quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    step="1"
                    isInvalid={touched.stock_quantity && !!errors.stock_quantity}
                    disabled={loading}
                />
                <Form.Control.Feedback type="invalid">{errors.stock_quantity}</Form.Control.Feedback>
            </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
            <div className="d-flex gap-4">
                <Form.Check
                    type="switch"
                    id="is_active"
                    label="Active"
                    name="is_active"
                    checked={values.is_active}
                    onChange={() => setFieldValue("is_active", !values.is_active)}
                    disabled={loading}
                />
                <Form.Check
                    type="switch"
                    id="is_in_stock"
                    label="In Stock"
                    name="is_in_stock"
                    checked={values.is_in_stock}
                    onChange={() => setFieldValue("is_in_stock", !values.is_in_stock)}
                    disabled={loading}
                />
            </div>
        </Col>
    </Row>
);

export default StockAndStatusFields;
