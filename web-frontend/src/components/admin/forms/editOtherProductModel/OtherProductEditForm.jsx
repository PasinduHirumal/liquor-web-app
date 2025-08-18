import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Form, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { CheckCircle } from "react-feather";

import BasicInfoSection from "./BasicInfoSection";
import PricingSection from "./PricingSection";
import InventorySection from "./InventorySection";
import StatusSection from "./StatusSection";
import MainImageSection from "./MainImageSection";
import GalleryImagesSection from "./GalleryImagesSection";

import { OtherProductService } from "./otherProducts";

const OtherProductEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
        superMarket_id: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
        add_quantity: 0,
        withdraw_quantity: 0,
        is_active: true,
        is_in_stock: true,
        weight: 0,
        main_image: "",
        images: [],
    });

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Helpers
    const toNumber = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : 0;
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setCategoriesLoading(true);
                const [cats, product] = await Promise.all([
                    OtherProductService.getCategories().catch((e) => {
                        setCategoriesError("Failed to load categories");
                        return [];
                    }),
                    OtherProductService.getById(id),
                ]);
                setCategories(cats);

                setFormData({
                    name: product?.name || "",
                    description: product?.description || "",
                    category_id: product?.category_id?.id ?? product?.category_id ?? "",
                    superMarket_id: product?.superMarket_id || "",
                    cost_price: product?.cost_price ?? 0,
                    marked_price: product?.marked_price ?? 0,
                    discount_percentage: product?.discount_percentage ?? 0,
                    stock_quantity: product?.stock_quantity ?? 0,
                    add_quantity: 0,
                    withdraw_quantity: 0,
                    is_active: product?.is_active ?? true,
                    is_in_stock: product?.is_in_stock ?? true,
                    weight: product?.weight ?? 0,
                    main_image: product?.main_image || "",
                    images: Array.isArray(product?.images) ? product.images : [],
                });
            } catch (error) {
                console.error(error);
                if (error?.response?.status === 404) {
                    toast.error("Product not found");
                    navigate("/products");
                } else {
                    toast.error("Failed to load product");
                }
            } finally {
                setCategoriesLoading(false);
                setLoading(false);
            }
        };

        fetchAll();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const numericFields = [
            "cost_price",
            "marked_price",
            "discount_percentage",
            "stock_quantity",
            "weight",
            "add_quantity",
            "withdraw_quantity",
        ];

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : numericFields.includes(name)
                        ? toNumber(value)
                        : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    // ---- Image handlers (fixed multiple files in gallery) ----
    const onUploadMain = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const base64 = await fileToBase64(file);
            setFormData((p) => ({ ...p, main_image: base64 }));
        } catch {
            toast.error("Failed to process image");
        } finally {
            e.target.value = "";
        }
    };

    const onRemoveMain = () => {
        setFormData((p) => ({ ...p, main_image: "" }));
    };

    const onUploadGallery = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        try {
            const results = await Promise.all(files.map((f) => fileToBase64(f)));
            setFormData((p) => ({ ...p, images: [...p.images, ...results] }));
        } catch {
            toast.error("Failed to process gallery images");
        } finally {
            e.target.value = "";
        }
    };

    const onRemoveGallery = (index) => {
        setFormData((p) => ({
            ...p,
            images: p.images.filter((_, i) => i !== index),
        }));
    };

    const onPickAsMain = (image) => {
        setFormData((p) => ({
            ...p,
            main_image: image,
            images: p.images.filter((img) => img !== image),
        }));
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    // ---- Validation & Submit ----
    const validateForm = () => {
        const ne = {};
        if (!formData.name.trim()) ne.name = "Name is required";
        if (!formData.category_id) ne.category_id = "Category is required";
        if (toNumber(formData.cost_price) <= 0) ne.cost_price = "Cost price must be positive";
        if (toNumber(formData.marked_price) <= 0) ne.marked_price = "Marked price must be positive";
        if (
            toNumber(formData.discount_percentage) < 0 ||
            toNumber(formData.discount_percentage) > 100
        ) {
            ne.discount_percentage = "Discount must be between 0-100%";
        }
        setErrors(ne);
        return Object.keys(ne).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await OtherProductService.updateGeneral(id, {
                name: formData.name,
                description: formData.description,
                category_id: formData.category_id,
                superMarket_id: formData.superMarket_id,
                is_active: formData.is_active,
                is_in_stock: formData.is_in_stock,
                weight: formData.weight,
                main_image: formData.main_image,
                images: formData.images,
            });

            await OtherProductService.updatePrice(id, {
                superMarket_id: formData.superMarket_id,
                cost_price: formData.cost_price,
                marked_price: formData.marked_price,
                discount_percentage: formData.discount_percentage,
            });

            if (formData.add_quantity > 0 || formData.withdraw_quantity > 0) {
                await OtherProductService.updateQuantity(id, {
                    add_quantity: formData.add_quantity,
                    withdraw_quantity: formData.withdraw_quantity,
                });
            }

            toast.success("Product updated successfully!");
            navigate("/other-product-list");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-white" style={{ height: "50vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="py-4 px-md-5 px-3 bg-white">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">Edit Product</h2>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={8}>
                                <BasicInfoSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    errors={errors}
                                    categories={categories}
                                    categoriesLoading={categoriesLoading}
                                    categoriesError={categoriesError}
                                />
                                <PricingSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    errors={errors}
                                />
                                <InventorySection
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                            </Col>

                            <Col md={4}>
                                <StatusSection
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                                <MainImageSection
                                    formData={formData}
                                    onUploadMain={onUploadMain}
                                    onRemoveMain={onRemoveMain}
                                />
                                <GalleryImagesSection
                                    formData={formData}
                                    onUploadGallery={onUploadGallery}
                                    onRemoveGallery={onRemoveGallery}
                                    onPickAsMain={onPickAsMain}
                                />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="me-2" size={16} />
                                        Update Product
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default OtherProductEditForm;
