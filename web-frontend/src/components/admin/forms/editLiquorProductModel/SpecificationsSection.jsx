import React from "react";
import { Card, Row, Col, FloatingLabel, Form } from "react-bootstrap";

const SpecificationsSection = ({ formData, handleChange }) => {
    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">Product Specifications</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <FloatingLabel controlId="alcohol" label="Alcohol Content (ABV%)" className="mb-3">
                            <Form.Control
                                name="alcohol_content"
                                type="number"
                                value={formData.alcohol_content}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                max="100"
                                placeholder="0.0"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md={6}>
                        <FloatingLabel controlId="volume" label="Volume (ml)" className="mb-3">
                            <Form.Control
                                name="volume"
                                type="number"
                                value={formData.volume}
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

export default SpecificationsSection;
