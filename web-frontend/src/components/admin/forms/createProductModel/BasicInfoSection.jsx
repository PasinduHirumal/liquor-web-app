import React, { useEffect, useState } from "react";
import { Form, FloatingLabel, Spinner, Alert, Image, Button } from "react-bootstrap";
import { FiUpload, FiX } from "react-icons/fi";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";

const BasicInfoSection = ({ formData, setFormData, isSubmitting, mainImage, setMainImage, imagePreviews, setImagePreviews }) => {
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match("image.*")) {
            toast.error("Please upload an image file");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) setMainImage({ file, preview: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const removeMainImage = () => setMainImage(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreviews((prev) => [
                        ...prev,
                        { id: Date.now() + Math.random(), file, preview: reader.result },
                    ]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (id) => {
        setImagePreviews((prev) => prev.filter((img) => img.id !== id));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const res = await axiosInstance.get("/categories/getAll");
                const activeCategories = (res.data.data || []).filter(
                    (cat) => cat.is_active && !cat.is_liquor
                );
                setCategories(activeCategories);
            } catch (err) {
                toast.error("Failed to fetch categories");
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <>
            <FloatingLabel controlId="name" label="Product Name" className="mb-3">
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                />
            </FloatingLabel>

            <FloatingLabel controlId="description" label="Description" className="mb-3">
                <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                    style={{ height: "120px" }}
                />
            </FloatingLabel>

            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                {categoriesLoading ? (
                    <Spinner animation="border" size="sm" />
                ) : (
                    <Form.Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                )}
            </Form.Group>

            {/* Main Image */}
            <Form.Group controlId="main_image" className="mb-3">
                <Form.Label>Main Product Image</Form.Label>
                <div className="border rounded p-3 text-center mb-3">
                    {mainImage ? (
                        <div className="position-relative d-inline-block">
                            <Image src={mainImage.preview} alt="Main" thumbnail />
                            <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={removeMainImage}
                                disabled={isSubmitting}
                            >
                                <FiX />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <label htmlFor="main-image-upload" style={{ cursor: "pointer" }}>
                                <FiUpload /> Click to upload
                            </label>
                            <Form.Control
                                id="main-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageChange}
                                disabled={isSubmitting}
                                className="d-none"
                            />
                        </>
                    )}
                </div>
            </Form.Group>

            {/* Multiple Images */}
            <Form.Group controlId="images" className="mb-3">
                <Form.Label>Other Product Images</Form.Label>
                <div className="border rounded p-3 text-center mb-3">
                    <label htmlFor="product-images-upload" style={{ cursor: "pointer" }}>
                        <FiUpload /> Upload Images
                    </label>
                    <Form.Control
                        id="product-images-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                    />
                </div>

                {imagePreviews.length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                        {imagePreviews.map((img) => (
                            <div key={img.id} className="position-relative" style={{ width: 80, height: 80 }}>
                                <Image src={img.preview} thumbnail className="w-100 h-100" />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0"
                                    onClick={() => removeImage(img.id)}
                                >
                                    <FiX />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Form.Group>
        </>
    );
};

export default BasicInfoSection;
