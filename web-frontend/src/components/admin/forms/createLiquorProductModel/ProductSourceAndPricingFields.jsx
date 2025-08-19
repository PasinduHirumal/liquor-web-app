import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../../lib/axios";

const ProductSourceAndPricingFields = ({ values, errors, touched, handleChange, handleBlur, loading }) => {
    const [superMarkets, setSuperMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingMarkets, setLoadingMarkets] = useState(false);

    // Fetch initial supermarket list
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                setLoadingMarkets(true);
                const res = await axiosInstance.get("/superMarket/getAllList");
                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching supermarkets:", error.message);
            } finally {
                setLoadingMarkets(false);
            }
        };
        fetchMarkets();
    }, []);

    useEffect(() => {
        const fetchMarketsBySearch = async () => {
            try {
                setLoadingMarkets(true);
                const res = searchTerm.trim()
                    ? await axiosInstance.get("/superMarket/search", { params: { q: searchTerm } })
                    : await axiosInstance.get("/superMarket/getAllList");

                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching supermarkets:", error.message);
            } finally {
                setLoadingMarkets(false);
            }
        };

        const debounce = setTimeout(fetchMarketsBySearch, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    return (
        <>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Source *</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search supermarkets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                        <Form.Select
                            name="superMarket_id"
                            className="mt-2"
                            value={values.superMarket_id}
                            onChange={handleChange}
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
                        </Form.Select>
                        {loadingMarkets && <Spinner animation="border" size="sm" className="ms-2" />}
                        <Form.Control.Feedback type="invalid">{errors.superMarket_id}</Form.Control.Feedback>
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
