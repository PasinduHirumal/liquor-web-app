import React from "react";
import { Card, Form, Button, Image, Alert } from "react-bootstrap";
import { UploadCloud, XCircle } from "react-feather";

const AdditionalImagesSection = ({
    existingImages,
    newImagesBase64,
    handleNewImagesChange,
    removeExistingImage,
    removeNewImage
}) => {
    return (
        <Card>
            <Card.Header>
                <h5 className="mb-0">Additional Product Images</h5>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <Form.Label>Current Images</Form.Label>
                    {existingImages.length === 0 ? (
                        <Alert variant="info">No additional images uploaded yet</Alert>
                    ) : (
                        <div className="d-flex flex-wrap gap-2">
                            {existingImages.map((url, idx) => (
                                <div key={idx} className="position-relative">
                                    <Image
                                        src={url}
                                        alt={`existing-${idx}`}
                                        thumbnail
                                        style={{ width: 80, height: 80, objectFit: 'contain' }}
                                        onError={(e) => (e.target.src = "/placeholder-bottle.jpg")}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 p-0 rounded-circle"
                                        style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                        onClick={() => removeExistingImage(url)}
                                        title="Remove image"
                                    >
                                        <XCircle size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <Form.Label>Add New Images</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleNewImagesChange}
                        className="d-none"
                        id="imageUpload"
                    />
                    <Button
                        variant="outline-primary"
                        as="label"
                        htmlFor="imageUpload"
                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                        <UploadCloud size={16} />
                        Upload Images
                    </Button>
                    <Form.Text className="text-muted">
                        Total Images ({existingImages.length + newImagesBase64.length})
                    </Form.Text>
                </div>

                {newImagesBase64.length > 0 && (
                    <div className="mt-2">
                        <h6>New Images to Upload</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {newImagesBase64.map((base64, idx) => (
                                <div key={idx} className="position-relative">
                                    <Image
                                        src={base64}
                                        alt={`new-${idx}`}
                                        thumbnail
                                        style={{ width: 80, height: 80, objectFit: 'contain' }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 p-0 rounded-circle"
                                        style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                        onClick={() => removeNewImage(idx)}
                                        title="Remove image"
                                    >
                                        <XCircle size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default AdditionalImagesSection;
