import React from "react";
import { Card, Row, Col, FloatingLabel, Form, Button, Spinner } from "react-bootstrap";

const InventorySection = ({ formData, handleChange, handleInventoryUpdate, updating }) => {
    return (
        <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Manage Inventory</h5>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleInventoryUpdate}
                    disabled={updating}
                >
                    {updating ? (
                        <Spinner as="span" animation="border" size="sm" />
                    ) : (
                        "Update Stock Only"
                    )}
                </Button>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <div className="mb-3">
                            <div className={`p-3 rounded ${formData.stock_quantity > 10 ? 'bg-success' : formData.stock_quantity > 0 ? 'bg-warning' : 'bg-danger'} text-white`}>
                                {formData.stock_quantity} units available
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="add_quantity" label="Add Quantity" className="mb-3">
                            <Form.Control
                                name="add_quantity"
                                type="number"
                                value={formData.add_quantity || 0}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="withdraw_quantity" label="Withdraw Quantity" className="mb-3">
                            <Form.Control
                                name="withdraw_quantity"
                                type="number"
                                value={formData.withdraw_quantity || 0}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InventorySection;
