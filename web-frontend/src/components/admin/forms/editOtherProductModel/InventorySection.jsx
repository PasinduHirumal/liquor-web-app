import React from "react";
import { Card, FloatingLabel, Form, Row, Col } from "react-bootstrap";

const InventorySection = ({ formData, handleChange }) => {
    return (
        <Card className="mb-4">
            <Card.Header><h5>Inventory Management</h5></Card.Header>
            <Card.Body>
                <Row>
                    <Col md={4}>
                        <FloatingLabel controlId="currentStock" label="Current Stock" className="mb-3">
                            <Form.Control
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                readOnly
                                plaintext
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <FloatingLabel controlId="addQuantity" label="Add Quantity" className="mb-3">
                            <Form.Control
                                type="number"
                                name="add_quantity"
                                value={formData.add_quantity}
                                onChange={handleChange}
                                min="0"
                                inputMode="numeric"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={4}>
                        <FloatingLabel controlId="withdrawQuantity" label="Withdraw Quantity" className="mb-3">
                            <Form.Control
                                type="number"
                                name="withdraw_quantity"
                                value={formData.withdraw_quantity}
                                onChange={handleChange}
                                min="0"
                                inputMode="numeric"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InventorySection;
