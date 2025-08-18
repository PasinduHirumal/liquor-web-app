import React, { useEffect, useState } from "react";
import { Card, Row, Col, FloatingLabel, Form } from "react-bootstrap";
import { axiosInstance } from "../../../../lib/axios";

const PricingInventorySection = ({ formData, handleInputChange, isSubmitting }) => {
    const [superMarkets, setSuperMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/superMarket/getAllList");
                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching supermarket list:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkets();
    }, []);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchTerm.trim()) return;
            try {
                setLoading(true);
                const res = await axiosInstance.get("/superMarket/search", {
                    params: { q: searchTerm },
                });
                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (error) {
                console.error("Error searching supermarkets:", error.message);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSearchResults, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    return (
        <Card className="mb-3">
            <Card.Body>
                <h6>Pricing & Inventory Information</h6>

                {/* Supermarket Selector */}
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="superMarket_id" label="Product Source (Super Market)">
                            <Form.Select
                                name="superMarket_id"
                                value={formData.superMarket_id}
                                onChange={handleInputChange}
                                disabled={isSubmitting || loading}
                            >
                                <option value="">Select a Super Market</option>
                                {superMarkets.map((market) => (
                                    <option key={market.superMarket_id} value={market.superMarket_id}>
                                        {market.superMarket_name} ({market.streetAddress})
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        {/* Search input for filtering supermarkets */}
                        <Form.Control
                            type="text"
                            placeholder="Search supermarkets..."
                            className="mt-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </Col>
                </Row>

                {/* Pricing Inputs */}
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="cost_price" label="Cost Price">
                            <Form.Control
                                type="number"
                                name="cost_price"
                                value={formData.cost_price}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                                step="0.01"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="marked_price" label="Marked Price">
                            <Form.Control
                                type="number"
                                name="marked_price"
                                value={formData.marked_price}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                                step="0.01"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>

                {/* Discount & Stock */}
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="discount_percentage" label="Discount %">
                            <Form.Control
                                type="number"
                                name="discount_percentage"
                                value={formData.discount_percentage}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                                max="100"
                            />
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="stock_quantity" label="Stock Quantity">
                            <Form.Control
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                min="0"
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PricingInventorySection;
