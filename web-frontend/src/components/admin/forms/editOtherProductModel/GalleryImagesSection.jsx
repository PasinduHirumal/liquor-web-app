import React from "react";
import { Card, Button, Form, Image, Alert } from "react-bootstrap";
import { UploadCloud, XCircle } from "react-feather";

const GalleryImagesSection = ({ formData, onUploadGallery, onRemoveGallery, onPickAsMain }) => {
    return (
        <Card>
            <Card.Header><h5>Gallery Images</h5></Card.Header>
            <Card.Body>
                {formData.images?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {formData.images.map((img, index) => (
                            <div key={index} className="position-relative">
                                <Image
                                    src={img}
                                    thumbnail
                                    style={{ width: 80, height: 80, objectFit: "cover" }}
                                    onClick={() => onPickAsMain(img)}
                                    className="cursor-pointer"
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0 p-0 rounded-circle"
                                    style={{ width: "20px", height: "20px", transform: "translate(30%, -30%)" }}
                                    onClick={() => onRemoveGallery(index)}
                                >
                                    <XCircle size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Alert variant="info" className="mb-3">No gallery images</Alert>
                )}

                <Form.Group controlId="galleryImageUpload">
                    <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        className="d-none"
                        id="galleryImageUpload"
                        onChange={onUploadGallery}
                    />
                    <Button variant="outline-secondary" as="label" htmlFor="galleryImageUpload" className="w-100">
                        <UploadCloud className="me-2" /> Add Gallery Images
                    </Button>
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default GalleryImagesSection;
