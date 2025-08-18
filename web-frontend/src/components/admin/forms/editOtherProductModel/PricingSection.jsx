import React, { useEffect, useState } from "react";
import { Card, FloatingLabel, Form, Row, Col, Dropdown, Spinner } from "react-bootstrap";
import { SuperMarketService } from "../../../../lib/otherProductEditModel/SuperMarketService";

const PricingSection = ({ formData, handleChange, errors }) => {
    const [superMarkets, setSuperMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);

    // Fetch all on mount
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                setLoading(true);
                const data = await SuperMarketService.getAll();
                setSuperMarkets(data);
            } catch (err) {
                console.error("Error loading supermarkets", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMarkets();
    }, []);

    // Fetch when searching
    useEffect(() => {
        const fetchSearch = async () => {
            try {
                setLoading(true);
                let data;
                if (searchTerm.trim()) {
                    data = await SuperMarketService.search(searchTerm);
                } else {
                    data = await SuperMarketService.getAll();
                }
                setSuperMarkets(data);
            } catch (err) {
                console.error("Error searching supermarkets", err);
            } finally {
                setLoading(false);
            }
        };
        const debounce = setTimeout(fetchSearch, 400);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectMarket = (market) => {
        setSelectedMarket(market);

        handleChange({
            target: {
                name: "superMarket_id",
                value: market.superMarket_id,
            },
        });
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <h5>Pricing</h5>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={12}>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                id="dropdown-supermarket"
                                className="w-100 text-start mb-3"
                                disabled={loading}
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

                    <Col md={6}>
                        <FloatingLabel controlId="costPrice" label="Cost Price (Rs)" className="mb-3">
                            <Form.Control
                                type="number"
                                name="cost_price"
                                value={formData.cost_price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                isInvalid={!!errors.cost_price}
                                inputMode="decimal"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.cost_price}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>

                    <Col md={6}>
                        <FloatingLabel controlId="markedPrice" label="Marked Price (Rs)" className="mb-3">
                            <Form.Control
                                type="number"
                                name="marked_price"
                                value={formData.marked_price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                isInvalid={!!errors.marked_price}
                                inputMode="decimal"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.marked_price}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <FloatingLabel controlId="discountPercentage" label="Discount (%)" className="mb-3">
                            <Form.Control
                                type="number"
                                name="discount_percentage"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="1"
                                isInvalid={!!errors.discount_percentage}
                                inputMode="numeric"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.discount_percentage}
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PricingSection;
