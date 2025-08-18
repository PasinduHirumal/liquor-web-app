import React from "react";
import { Card, Row, Col, FloatingLabel, Form } from "react-bootstrap";

const PricingInventorySection = ({ formData, handleInputChange, isSubmitting }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <h6>Pricing & Inventory Information</h6>
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="superMarket_id" label="Product Source">
                            <Form.Control
                                type="text"
                                name="superMarket_id"
                                value={formData.superMarket_id}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="cost_price" label="Cost Price">
                            <Form.Control
                                type="number"
                                name="cost_price"
                                value={formData.cost_price}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                                step="0.01"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="marked_price" label="Marked Price">
                            <Form.Control
                                type="number"
                                name="marked_price"
                                value={formData.marked_price}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                                step="0.01"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="discount_percentage" label="Discount %">
                            <Form.Control
                                type="number"
                                name="discount_percentage"
                                value={formData.discount_percentage}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                max="100"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="stock_quantity" label="Stock Quantity">
                            <Form.Control
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PricingInventorySection;
