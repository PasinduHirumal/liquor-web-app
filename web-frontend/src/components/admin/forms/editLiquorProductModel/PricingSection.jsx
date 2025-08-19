import React from "react";
import { Card, Row, Col, FloatingLabel, Form, Button, Spinner } from "react-bootstrap";

const PricingSection = ({
    formData,
    handleChange,
    errors,
    handlePriceUpdate,
    priceUpdating
}) => {
    return (
        <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Update Pricing</h5>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handlePriceUpdate}
                    disabled={priceUpdating}
                >
                    {priceUpdating ? (
                        <Spinner as="span" animation="border" size="sm" />
                    ) : (
                        "Update Price Only"
                    )}
                </Button>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={12}>
                        <FloatingLabel controlId="superMarket_id" label="Product Source (e.g., Keels, Food City)" className="mb-3">
                            <Form.Control
                                name="superMarket_id"
                                value={formData.superMarket_id}
                                onChange={handleChange}
                                placeholder="Enter where product is from"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FloatingLabel controlId="cost_price" label="Cost Price (Rs)" className="mb-3">
                            <Form.Control
                                name="cost_price"
                                type="number"
                                value={formData.cost_price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                isInvalid={!!errors.cost_price}
                                placeholder="0.00"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.cost_price}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="marked_price" label="Marked Price (Rs)" className="mb-3">
                            <Form.Control
                                name="marked_price"
                                type="number"
                                value={formData.marked_price}
                                onChange={handleChange}
                                step="0.01"
                                min="0.01"
                                isInvalid={!!errors.marked_price}
                                placeholder="0.00"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.marked_price}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FloatingLabel controlId="discount_percentage" label="Discount (%)" className="mb-3">
                            <Form.Control
                                name="discount_percentage"
                                type="number"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                step="1"
                                min="0"
                                max="100"
                                isInvalid={!!errors.discount_percentage}
                                placeholder="0"
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
