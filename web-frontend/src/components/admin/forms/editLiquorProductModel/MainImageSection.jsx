import React from "react";
import { Card, Form, Button, Image, Alert } from "react-bootstrap";
import { UploadCloud, XCircle } from "react-feather";

const MainImageSection = ({
    existingMainImage,
    newMainImageBase64,
    handleMainImageChange,
    removeExistingMainImage,
    removeNewMainImage
}) => {
    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">Main Product Image</h5>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <Form.Label>Current Main Image</Form.Label>
                    {!existingMainImage && !newMainImageBase64 ? (
                        <Alert variant="info">No main image uploaded yet</Alert>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="position-relative">
                                <Image
                                    src={newMainImageBase64 || existingMainImage}
                                    alt="main-product"
                                    thumbnail
                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    onError={(e) => (e.target.src = "/placeholder-bottle.jpg")}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0 p-0 rounded-circle"
                                    style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                    onClick={newMainImageBase64 ? removeNewMainImage : removeExistingMainImage}
                                    title="Remove image"
                                >
                                    <XCircle size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <Form.Label>Upload New Main Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="d-none"
                        id="mainImageUpload"
                    />
                    <Button
                        variant="outline-primary"
                        as="label"
                        htmlFor="mainImageUpload"
                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                        <UploadCloud size={16} />
                        Upload Main Image
                    </Button>
                    <Form.Text className="text-muted">
                        Recommended ratio: 1:1 (square)
                    </Form.Text>
                </div>
            </Card.Body>
        </Card>
    );
};

export default MainImageSection;
