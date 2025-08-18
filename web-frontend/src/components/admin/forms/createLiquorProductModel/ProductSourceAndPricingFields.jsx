import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spinner, Dropdown } from "react-bootstrap";
import { axiosInstance } from "../../../../lib/axios";

const ProductSourceAndPricingFields = ({ values, errors, touched, handleChange, handleBlur, loading, setFieldValue }) => {
    const [superMarkets, setSuperMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingMarkets, setLoadingMarkets] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);

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

    // Search supermarkets
    useEffect(() => {
        if (!searchTerm.trim()) return;

        const fetchSearchResults = async () => {
            try {
                setLoadingMarkets(true);
                const res = await axiosInstance.get("/superMarket/search", {
                    params: { q: searchTerm },
                });
                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (error) {
                console.error("Error searching supermarkets:", error.message);
            } finally {
                setLoadingMarkets(false);
            }
        };

        const debounce = setTimeout(fetchSearchResults, 500); // debounce
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectMarket = (market) => {
        setSelectedMarket(market);
        setFieldValue("superMarket_id", market.superMarket_id);
    };

    return (
        <>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Source *</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                id="dropdown-supermarket"
                                disabled={loading || loadingMarkets}
                                className="w-100 text-start"
                            >
                                {selectedMarket
                                    ? `${selectedMarket.superMarket_name} (${selectedMarket.streetAddress})`
                                    : "Select a Super Market"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100 p-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search supermarkets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={loading}
                                    className="mb-2"
                                />

                                {loadingMarkets && (
                                    <div className="text-center py-2">
                                        <Spinner animation="border" size="sm" />
                                    </div>
                                )}

                                {!loadingMarkets && superMarkets.length === 0 && (
                                    <div className="text-muted text-center py-2">No supermarkets found</div>
                                )}

                                {!loadingMarkets &&
                                    superMarkets.map((market) => (
                                        <Dropdown.Item
                                            key={market.superMarket_id}
                                            onClick={() => handleSelectMarket(market)}
                                        >
                                            {market.superMarket_name} ({market.streetAddress})
                                        </Dropdown.Item>
                                    ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {touched.superMarket_id && errors.superMarket_id && (
                            <div className="invalid-feedback d-block">{errors.superMarket_id}</div>
                        )}
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
