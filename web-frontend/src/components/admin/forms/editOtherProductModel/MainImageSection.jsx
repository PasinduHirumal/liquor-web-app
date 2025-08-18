import React from "react";
import { Card, Button, Form, Image } from "react-bootstrap";
import { UploadCloud, XCircle, Image as ImageIcon } from "react-feather";

const MainImageSection = ({ formData, onUploadMain, onRemoveMain }) => {
    return (
        <Card className="mb-4">
            <Card.Header><h5>Main Image</h5></Card.Header>
            <Card.Body>
                {formData.main_image ? (
                    <div className="position-relative mb-3">
                        <Image
                            src={formData.main_image}
                            thumbnail
                            fluid
                            className="w-100"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                        />
                        <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1 rounded-circle"
                            onClick={onRemoveMain}
                        >
                            <XCircle size={16} />
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-4 border rounded mb-3">
                        <ImageIcon size={48} className="text-muted mb-2" />
                        <p className="text-muted">No main image selected</p>
                    </div>
                )}

                <Form.Group controlId="mainImageUpload">
                    <Form.Control
                        type="file"
                        accept="image/*"
                        className="d-none"
                        id="mainImageUpload"
                        onChange={onUploadMain}
                    />
                    <Button variant="outline-primary" as="label" htmlFor="mainImageUpload" className="w-100">
                        <UploadCloud className="me-2" />
                        {formData.main_image ? "Change Main Image" : "Upload Main Image"}
                    </Button>
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default MainImageSection;
