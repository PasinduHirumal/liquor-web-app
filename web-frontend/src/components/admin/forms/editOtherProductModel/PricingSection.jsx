import React from "react";
import { Card, FloatingLabel, Form, Row, Col } from "react-bootstrap";

const PricingSection = ({ formData, handleChange, errors }) => {
    return (
        <Card className="mb-4">
            <Card.Header><h5>Pricing</h5></Card.Header>
            <Card.Body>
                <Row>
                    <Col md={12}>
                        <FloatingLabel
                            controlId="productFrom"
                            label="Product Source (e.g., Keels, Food City)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="superMarket_id"
                                value={formData.superMarket_id}
                                onChange={handleChange}
                                placeholder="Where the product is from"
                                autoComplete="off"
                            />
                        </FloatingLabel>
                    </Col>

                    <Col md={6}>
                        <FloatingLabel controlId="costPrice" label="Cost Price (Rs)" className="mb-3">
                            <Form.Control
                                type="number"
                                name="cost_price"
                                value={formData.cost_price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                isInvalid={!!errors.cost_price}
                                inputMode="decimal"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.cost_price}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>

                    <Col md={6}>
                        <FloatingLabel controlId="markedPrice" label="Marked Price (Rs)" className="mb-3">
                            <Form.Control
                                type="number"
                                name="marked_price"
                                value={formData.marked_price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                isInvalid={!!errors.marked_price}
                                inputMode="decimal"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.marked_price}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <FloatingLabel controlId="discountPercentage" label="Discount (%)" className="mb-3">
                            <Form.Control
                                type="number"
                                name="discount_percentage"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="1"
                                isInvalid={!!errors.discount_percentage}
                                inputMode="numeric"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.discount_percentage}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PricingSection;
