import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";
import { Container, Form, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { CheckCircle } from "react-feather";

// Import refactored sections
import BasicInfoSection from "./BasicInfoSection";
import PricingSection from "./PricingSection";
import InventorySection from "./InventorySection";
import SpecificationsSection from "./SpecificationsSection";
import StatusSection from "./StatusSection";
import MainImageSection from "./MainImageSection";
import AdditionalImagesSection from "./AdditionalImagesSection";

const LiquorEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brand: "",
        category_id: "",
        alcohol_content: 0,
        volume: 0,
        superMarket_id: "",
        cost_price: 0,
        marked_price: 0,
        discount_percentage: 0,
        stock_quantity: 0,
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
    });

    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingMainImage, setExistingMainImage] = useState(null);
    const [newMainImageBase64, setNewMainImageBase64] = useState(null);
    const [newImagesBase64, setNewImagesBase64] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [priceUpdating, setPriceUpdating] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get("/categories/getAll");
                const liquorCategories = (res.data.data || []).filter(cat => cat.is_active && cat.is_liquor);
                setCategories(liquorCategories);
            } catch (err) {
                toast.error("Failed to load categories.");
                console.error(err);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/getProductById/${id}`);
                const product = res.data.data;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    brand: product.brand || "",
                    category_id: product.category_id?._id || product.category_id || "",
                    alcohol_content: product.alcohol_content || 0,
                    volume: product.volume || 0,
                    superMarket_id: product.superMarket_id || "", // Fix: Get from product data
                    cost_price: product.cost_price || 0,
                    marked_price: product.marked_price || 0,
                    discount_percentage: product.discount_percentage || 0,
                    stock_quantity: product.stock_quantity || 0,
                    is_active: product.is_active ?? true,
                    is_in_stock: product.is_in_stock ?? true,
                    is_liquor: product.is_liquor ?? true,
                });

                setExistingMainImage(product.main_image || null);
                setExistingImages(product.images || []);
            } catch (err) {
                toast.error("Failed to load product.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.category_id) newErrors.category_id = "Category is required";
        if (formData.cost_price < 0) newErrors.cost_price = "Cost price cannot be negative";
        if (formData.marked_price <= 0) newErrors.marked_price = "Price must be greater than 0";
        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            newErrors.discount_percentage = "Discount must be between 0-100%";
        }
        if (formData.stock_quantity < 0) newErrors.stock_quantity = "Stock cannot be negative";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (["cost_price", "marked_price", "discount_percentage",
            "stock_quantity", "alcohol_content", "volume",
            "add_quantity", "withdraw_quantity"].includes(name)) {
            newValue = parseFloat(newValue) || 0;
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handlePriceUpdate = async (e) => {
        e.preventDefault();

        if (formData.marked_price <= 0) {
            setErrors({ marked_price: "Price must be greater than 0" });
            return;
        }

        if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
            setErrors({ discount_percentage: "Discount must be between 0-100%" });
            return;
        }

        setPriceUpdating(true);
        try {
            const priceData = {
                superMarket_id: formData.superMarket_id,
                cost_price: formData.cost_price,
                marked_price: formData.marked_price,
                discount_percentage: formData.discount_percentage
            };

            await axiosInstance.patch(`/products/update-price/${id}`, priceData);
            toast.success("Price updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Price update failed.");
        } finally {
            setPriceUpdating(false);
        }
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleMainImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64Image = await fileToBase64(file);
            setNewMainImageBase64(base64Image);
        } catch (error) {
            toast.error("Failed to read main image file.");
        }
    };

    const handleNewImagesChange = async (e) => {
        const files = Array.from(e.target.files);

        try {
            const base64Promises = files.map((file) => fileToBase64(file));
            const base64Images = await Promise.all(base64Promises);
            setNewImagesBase64((prev) => [...prev, ...base64Images]);
        } catch (error) {
            toast.error("Failed to read image files.");
        }
    };

    const removeExistingMainImage = () => {
        setExistingMainImage(null);
    };

    const removeNewMainImage = () => {
        setNewMainImageBase64(null);
    };

    const removeExistingImage = (url) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const removeNewImage = (index) => {
        setNewImagesBase64((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInventoryUpdate = async (e) => {
        e.preventDefault();

        const { add_quantity, withdraw_quantity } = formData;
        const currentStock = formData.stock_quantity + (add_quantity || 0) - (withdraw_quantity || 0);

        if (currentStock < 0) {
            setErrors({ stock_quantity: "Insufficient stock for this operation" });
            return;
        }

        setUpdating(true);
        try {
            const inventoryData = {
                add_quantity: add_quantity || 0,
                withdraw_quantity: withdraw_quantity || 0
            };

            await axiosInstance.patch(`/products/update-quantity/${id}`, inventoryData);
            toast.success("Inventory updated successfully!");

            setFormData(prev => ({
                ...prev,
                stock_quantity: currentStock,
                add_quantity: 0,
                withdraw_quantity: 0
            }));
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Inventory update failed.");
        } finally {
            setUpdating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!existingMainImage && !newMainImageBase64) {
            toast.error("Please upload a main image before updating.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setUpdating(true);

        try {
            const payload = {
                ...formData,
                main_image: newMainImageBase64 || existingMainImage,
                images: [...existingImages, ...newImagesBase64],
                marked_price: undefined,
                discount_percentage: undefined,
                cost_price: undefined,
                add_quantity: undefined,
                withdraw_quantity: undefined
            };

            await axiosInstance.patch(`/products/update/${id}`, payload);
            toast.success("Product updated successfully!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Update failed.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-white" style={{ height: "50vh" }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="py-5 bg-white px-md-5 px-4" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">Edit Liquor Product</h2>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            <Col md={8}>
                                <BasicInfoSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    categories={categories}
                                    errors={errors}
                                />
                                <PricingSection
                                    formData={formData}
                                    handleChange={handleChange}
                                    errors={errors}
                                    handlePriceUpdate={handlePriceUpdate}
                                    priceUpdating={priceUpdating}
                                />
                                <InventorySection
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleInventoryUpdate={handleInventoryUpdate}
                                    updating={updating}
                                />
                                <SpecificationsSection
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
                                    existingMainImage={existingMainImage}
                                    newMainImageBase64={newMainImageBase64}
                                    handleMainImageChange={handleMainImageChange}
                                    removeExistingMainImage={removeExistingMainImage}
                                    removeNewMainImage={removeNewMainImage}
                                />
                                <AdditionalImagesSection
                                    existingImages={existingImages}
                                    newImagesBase64={newImagesBase64}
                                    handleNewImagesChange={handleNewImagesChange}
                                    removeExistingImage={removeExistingImage}
                                    removeNewImage={removeNewImage}
                                />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate(-1)}
                                disabled={updating || priceUpdating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={updating || priceUpdating}
                            >
                                {updating ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} className="me-2" />
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

export default LiquorEditForm;