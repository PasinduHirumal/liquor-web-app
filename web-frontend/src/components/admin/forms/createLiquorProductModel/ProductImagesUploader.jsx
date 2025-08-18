import React from "react";
import { Form, Alert } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import ImagePreview from "../../../../common/ImagePreview";

const ProductImagesUploader = ({ images, mainImage, handleImageChange, removeImage, setMainImage, touched, loading }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Product Images *</Form.Label>
            <div className="border rounded p-3 text-center">
                <label htmlFor="product-images" className="btn btn-outline-primary">
                    <FaUpload className="me-2" />
                    {images.length > 0 ? "Add More Images" : "Upload Images"}
                    <input
                        id="product-images"
                        type="file"
                        name="images"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        disabled={loading || images.length >= 5}
                        className="d-none"
                    />
                </label>
                {images.length > 0 && <p className="small text-muted mt-2 mb-0">{images.length} image(s) selected</p>}
            </div>
        </Form.Group>

        {images.length > 0 && (
            <div className="mb-4">
                <Form.Label>Image Preview</Form.Label>
                <div className="d-flex flex-wrap gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="position-relative">
                            <ImagePreview src={img} onRemove={() => removeImage(index)} />
                            <Form.Check
                                type="radio"
                                name="mainImage"
                                label="Main"
                                checked={mainImage === img}
                                onChange={() => setMainImage(img)}
                                className="position-absolute top-0 start-0 m-2 bg-white px-2 rounded"
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}

        {images.length === 0 && touched.category_id && (
            <Alert variant="warning" className="mb-4">
                Please upload at least one product image
            </Alert>
        )}
    </>
);

export default ProductImagesUploader;
