import React, { useState } from "react";
import { Modal, Button, Spinner, Row, Col, Form } from "react-bootstrap";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";
import BasicInfoSection from "./BasicInfoSection";
import PricingInventorySection from "./PricingInventorySection";
import AdditionalInfoSection from "./AdditionalInfoSection";

const CreateProductModal = ({ show, onHide, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        superMarket_id: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
        weight: 0,
        is_active: true,
        is_in_stock: true,
    });

    const [mainImage, setMainImage] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return toast.error("Name required"), false;
        if (!formData.description.trim()) return toast.error("Description required"), false;
        if (!formData.category_id) return toast.error("Select category"), false;
        if (formData.cost_price <= 0) return toast.error("Cost price > 0 required"), false;
        if (formData.marked_price <= 0) return toast.error("Marked price > 0 required"), false;
        if (!mainImage) return toast.error("Main image required"), false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const mainImageBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(mainImage.file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
            });

            const base64Images = await Promise.all(
                imagePreviews.map(
                    (img) =>
                        new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(img.file);
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                        })
                )
            );

            const payload = { ...formData, main_image: mainImageBase64, images: base64Images };
            await axiosInstance.post("/other-products/create", payload);

            toast.success("Product created successfully!");
            onProductCreated();
            handleReset();
            onHide();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: "",
            description: "",
            category_id: "",
            superMarket_id: "",
            cost_price: 0,
            marked_price: 0,
            discount_percentage: 0,
            stock_quantity: 0,
            weight: 0,
            is_active: true,
            is_in_stock: true,
        });
        setMainImage(null);
        setImagePreviews([]);
    };

    return (
        <Modal className="pt-5" show={show} onHide={() => { handleReset(); onHide(); }} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <BasicInfoSection
                                formData={formData}
                                setFormData={setFormData}
                                isSubmitting={isSubmitting}
                                mainImage={mainImage}
                                setMainImage={setMainImage}
                                imagePreviews={imagePreviews}
                                setImagePreviews={setImagePreviews}
                            />
                        </Col>
                        <Col md={6}>
                            <PricingInventorySection
                                formData={formData}
                                handleInputChange={handleInputChange}
                                isSubmitting={isSubmitting}
                            />
                            <AdditionalInfoSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                                isSubmitting={isSubmitting}
                            />
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button variant="outline-secondary" onClick={() => { handleReset(); onHide(); }} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? <><Spinner size="sm" /> Creating...</> : "Create Product"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateProductModal;
