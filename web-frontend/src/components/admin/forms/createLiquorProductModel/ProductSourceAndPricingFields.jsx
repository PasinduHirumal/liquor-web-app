import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../../lib/axios";

const ProductSourceAndPricingFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, loading }) => {
    const [superMarkets, setSuperMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingMarkets, setLoadingMarkets] = useState(false);

    // Fetch all supermarkets on mount
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                setLoadingMarkets(true);
                const res = await axiosInstance.get("/superMarket/getAllList");
                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch supermarkets:", err.message);
            } finally {
                setLoadingMarkets(false);
            }
        };
        fetchMarkets();
    }, []);

    // Search supermarkets when searchTerm changes (debounced)
    useEffect(() => {
        if (!searchTerm.trim()) return;

        const debounceTimer = setTimeout(async () => {
            try {
                setLoadingMarkets(true);
                const res = await axiosInstance.get("/superMarket/search", {
                    params: { q: searchTerm },
                });
                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (err) {
                console.error("Search supermarkets error:", err.message);
            } finally {
                setLoadingMarkets(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    return (
        <>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Source *</Form.Label>
                        <Form.Control
                            as="select"
                            name="superMarket_id"
                            value={values.superMarket_id}
                            onChange={(e) => setFieldValue("superMarket_id", e.target.value)}
                            onBlur={handleBlur}
                            isInvalid={touched.superMarket_id && !!errors.superMarket_id}
                            disabled={loading || loadingMarkets}
                        >
                            <option value="">Select a Super Market</option>
                            {superMarkets.map((market) => (
                                <option key={market.superMarket_id} value={market.superMarket_id}>
                                    {market.superMarket_name} ({market.streetAddress})
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.superMarket_id}</Form.Control.Feedback>

                        <Form.Control
                            type="text"
                            placeholder="Search supermarkets..."
                            className="mt-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Cost Price *</Form.Label>
                        <Form.Control
                            type="number"
                            name="cost_price"
                            value={values.cost_price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min="0"
                            step="0.01"
                            isInvalid={touched.cost_price && !!errors.cost_price}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">{errors.cost_price}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Marked Price *</Form.Label>
                        <Form.Control
                            type="number"
                            name="marked_price"
                            value={values.marked_price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min="0"
                            step="0.01"
                            isInvalid={touched.marked_price && !!errors.marked_price}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">{errors.marked_price}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Discount (%) *</Form.Label>
                        <Form.Control
                            type="number"
                            name="discount_percentage"
                            value={values.discount_percentage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min="0"
                            max="100"
                            step="0.01"
                            isInvalid={touched.discount_percentage && !!errors.discount_percentage}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">{errors.discount_percentage}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};

export default ProductSourceAndPricingFields;
