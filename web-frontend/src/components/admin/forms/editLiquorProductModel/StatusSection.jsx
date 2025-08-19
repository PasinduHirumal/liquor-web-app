import React from "react";
import { Card, Form } from "react-bootstrap";

const StatusSection = ({ formData, handleChange }) => {
    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">Status</h5>
            </Card.Header>
            <Card.Body>
                <Form.Check
                    type="switch"
                    id="is_active"
                    label="Active Product"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="mb-3"
                />
                <Form.Check
                    type="switch"
                    id="is_in_stock"
                    label="In Stock"
                    name="is_in_stock"
                    checked={formData.is_in_stock}
                    onChange={handleChange}
                />
            </Card.Body>
        </Card>
    );
};

export default StatusSection;
