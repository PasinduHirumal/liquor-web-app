import React, { useEffect, useState } from "react";
import { Card, Row, Col, FloatingLabel, Form, Dropdown, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../../lib/axios";

const PricingInventorySection = ({ formData, handleInputChange, isSubmitting }) => {
    const [superMarkets, setSuperMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);

    // Initial load
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

    // Debounced search
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                let res;
                if (searchTerm.trim()) {
                    res = await axiosInstance.get("/superMarket/search", {
                        params: { q: searchTerm },
                    });
                } else {
                    res = await axiosInstance.get("/superMarket/getAllList");
                }

                if (res.data.success) {
                    setSuperMarkets(res.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching supermarkets:", error.message);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchData, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSelectMarket = (market) => {
        setSelectedMarket(market);
        handleInputChange({
            target: {
                name: "superMarket_id",
                value: market.superMarket_id,
            },
        });
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <h6>Pricing & Inventory Information</h6>
                <Row className="g-2 mb-3">
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                id="dropdown-supermarket"
                                disabled={isSubmitting || loading}
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
                                    disabled={isSubmitting}
                                    className="mb-2"
                                />

                                {loading && (
                                    <div className="text-center py-2">
                                        <Spinner animation="border" size="sm" />
                                    </div>
                                )}

                                {!loading && superMarkets.length === 0 && (
                                    <div className="text-muted text-center py-2">No supermarkets found</div>
                                )}

                                {!loading &&
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
