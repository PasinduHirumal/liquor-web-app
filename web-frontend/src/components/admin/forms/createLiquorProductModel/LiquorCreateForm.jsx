import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Formik } from "formik";
import { axiosInstance } from "../../../../lib/axios";

import ProductNameBrandFields from "./ProductNameBrandFields";
import ProductDescriptionField from "./ProductDescriptionField";
import CategoryAndVolumeFields from "./CategoryAndVolumeFields";
import ProductSourceAndPricingFields from "./ProductSourceAndPricingFields";
import StockAndStatusFields from "./StockAndStatusFields";
import ProductImagesUploader from "./ProductImagesUploader";
import ProductCountryField from "./ProductCountryField";
import ProductFlavourFields from "./ProductFlavourFields";

const LiquorCreateForm = ({ onSuccess, onCancel }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosInstance.get('/categories/getAll');
                const liquorCategories = (res.data.data || []).filter(cat => cat.is_active && cat.is_liquor);
                setCategories(liquorCategories);
            } catch (err) {
                toast.error('Failed to fetch categories');
                console.error('Category fetch error:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const readers = files.map(file =>
            new Promise((resolve, reject) => {
                if (!file.type.match('image.*')) {
                    reject(new Error('File is not an image'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            })
        );

        Promise.all(readers)
            .then((base64Images) => {
                setImages(prev => {
                    const updated = [...prev, ...base64Images];
                    if (!mainImage && updated.length > 0) {
                        setMainImage(updated[0]);
                    }
                    return updated;
                });
            })
            .catch((err) => {
                toast.error(err.message || 'Failed to read image files');
                console.error('Image read error:', err);
            });
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            if (prev[index] === mainImage) {
                setMainImage(updated[0] || null);
            }
            return updated;
        });
    };

    const handleSubmit = async (values) => {
        if (images.length === 0) {
            toast.error('Please upload at least one product image.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...values,
                main_image: mainImage,
                images: images.filter((img) => img !== mainImage),
                is_liquor: true,
                add_quantity: 0,
                withdraw_quantity: 0
            };

            const res = await axiosInstance.post('/products/create', payload);

            toast.success('Product created successfully!');
            onSuccess(res.data.data);
            setImages([]);
        } catch (err) {
            const resData = err.response?.data;
            if (resData?.errors?.length) {
                resData.errors.forEach(e => {
                    toast.error(`${e.field}: ${e.message}`);
                });
            } else {
                toast.error(resData?.message || 'Failed to create product');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Card.Body>
                <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        category_id: "",
                        brand: "",
                        alcohol_content: "",
                        volume: "",
                        superMarket_id: "",
                        country: "",
                        flavour_profile: {
                            primary_flavour: "",
                            notes: "",
                            sweetness: 0,
                            bitterness: 0,
                            smokiness: 0,
                            finish: "",
                        },
                        cost_price: "",
                        marked_price: "",
                        discount_percentage: "",
                        stock_quantity: "",
                        is_active: true,
                        is_in_stock: true,
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>
                            <ProductNameBrandFields {...{ values, errors, touched, handleChange, handleBlur, loading }} />
                            <ProductDescriptionField {...{ values, errors, touched, handleChange, handleBlur, loading }} />
                            <CategoryAndVolumeFields {...{ categories, values, errors, touched, handleChange, handleBlur, loading }} />
                            <ProductCountryField {...{ values, errors, touched, handleChange, handleBlur, loading }} />
                            <ProductFlavourFields {...{ values, errors, touched, handleChange, handleBlur, setFieldValue, loading }} />
                            <ProductSourceAndPricingFields {...{ values, errors, touched, handleChange, handleBlur, loading }} />
                            <StockAndStatusFields {...{ values, errors, touched, handleChange, handleBlur, setFieldValue, loading }} />
                            <ProductImagesUploader {...{ images, mainImage, handleImageChange, removeImage, setMainImage, touched, loading }} />

                            <div className="d-flex justify-content-end gap-3 mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => {
                                        onCancel();
                                        toast.info("Creation cancelled.");
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" disabled={loading} className="d-flex align-items-center gap-2">
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" /> Creating...
                                        </>
                                    ) : (
                                        "Create Product"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    );
};

export default LiquorCreateForm;
