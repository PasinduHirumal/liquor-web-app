import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Container, Row, Col, Card, Spinner, Alert, Button, Modal, Form } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

const SystemDetail = () => {
    const [companyDetail, setCompanyDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        where_house_location: { lat: "", lng: "" },
        delivery_charge_for_1KM: "",
        service_charge: ""
    });

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            try {
                const res = await axiosInstance.get("/system/details");
                setCompanyDetail(res.data.data);
                setFormData({
                    where_house_location: res.data.data.where_house_location || { lat: "", lng: "" },
                    delivery_charge_for_1KM: res.data.data.delivery_charge_for_1KM || "",
                    service_charge: res.data.data.service_charge || ""
                });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch system details");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetail();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "lat" || name === "lng") {
            setFormData(prev => ({
                ...prev,
                where_house_location: {
                    ...prev.where_house_location,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.patch(`/system/update/${companyDetail.id}`, formData);
            const res = await axiosInstance.get("/system/details");
            setCompanyDetail(res.data.data);
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update system details");
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <h2 className="text-center mb-4">System Details</h2>

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    ) : (
                        <>
                            <Card className="shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span>System Information</span>
                                    <Button
                                        variant="link"
                                        onClick={() => setShowModal(true)}
                                        aria-label="Edit"
                                    >
                                        <PencilSquare size={20} />
                                    </Button>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <strong>Warehouse Location:</strong><br />
                                        Latitude: {companyDetail?.where_house_location?.lat ?? "N/A"}<br />
                                        Longitude: {companyDetail?.where_house_location?.lng ?? "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Delivery Charge per 1KM:</strong>{" "}
                                        {companyDetail?.delivery_charge_for_1KM ?? "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Service Charge:</strong>{" "}
                                        {companyDetail?.service_charge ?? "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Created At:</strong>{" "}
                                        {companyDetail?.created_at
                                            ? new Date(companyDetail.created_at).toLocaleString()
                                            : "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Updated At:</strong>{" "}
                                        {companyDetail?.updated_at
                                            ? new Date(companyDetail.updated_at).toLocaleString()
                                            : "N/A"}
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            {/* Edit Modal */}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit System Details</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Warehouse Latitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="lat"
                                                value={formData.where_house_location.lat}
                                                onChange={handleInputChange}
                                                step="any"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Warehouse Longitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="lng"
                                                value={formData.where_house_location.lng}
                                                onChange={handleInputChange}
                                                step="any"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Delivery Charge per 1KM</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="delivery_charge_for_1KM"
                                                value={formData.delivery_charge_for_1KM}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Service Charge</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="service_charge"
                                                value={formData.service_charge}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SystemDetail;