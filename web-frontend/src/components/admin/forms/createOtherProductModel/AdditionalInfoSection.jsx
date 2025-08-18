import React from "react";
import { Card, Row, Col, FloatingLabel, Form } from "react-bootstrap";

const AdditionalInfoSection = ({ formData, handleInputChange, isSubmitting }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <h6>Additional Information</h6>
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="weight" label="Weight (optional)">
                            <Form.Control
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                step="0.01"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <div className="d-flex gap-4">
                    <Form.Check
                        type="switch"
                        id="is_active"
                        name="is_active"
                        label="Active Product"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                    <Form.Check
                        type="switch"
                        id="is_in_stock"
                        name="is_in_stock"
                        label="In Stock"
                        checked={formData.is_in_stock}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default AdditionalInfoSection;
