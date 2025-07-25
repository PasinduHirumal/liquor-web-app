import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

function DriverVehicleInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [vehicleData, setVehicleData] = useState({
        vehicleType: "",
        vehicleModel: "",
        vehicleNumber: "",
        vehicleColor: "",
        vehicleYear: "",
        vehicleInsurance: "",
        vehicleRegistration: "",
    });

    // Fetch existing driver vehicle info
    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const res = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const data = res.data.data;

                setVehicleData({
                    vehicleType: data.vehicleType || "",
                    vehicleModel: data.vehicleModel || "",
                    vehicleNumber: data.vehicleNumber || "",
                    vehicleColor: data.vehicleColor || "",
                    vehicleYear: data.vehicleYear || "",
                    vehicleInsurance: data.vehicleInsurance || "",
                    vehicleRegistration: data.vehicleRegistration || "",
                });
            } catch (err) {
                toast.error("Failed to fetch driver data");
            } finally {
                setLoading(false);
            }
        };

        fetchDriver();
    }, [id]);

    const handleChange = (e) => {
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axiosInstance.patch(`/drivers/update-vehicleInfo/${id}`, vehicleData);
            toast.success("Vehicle info updated successfully!");
            navigate(-1);
        } catch (err) {
            const message = err.response?.data?.error || "Update failed";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container className="my-4">
            <Row className="align-items-center mb-4">
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        ← Back
                    </Button>
                </Col>
                <Col>
                    <h3 className="text-primary mb-0">Edit Vehicle Information</h3>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="vehicleType">
                            <Form.Label>
                                Vehicle Type <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                name="vehicleType"
                                value={vehicleData.vehicleType}
                                onChange={handleChange}
                                required
                                aria-label="Select Vehicle Type"
                            >
                                <option value="">Select Vehicle Type</option>
                                <option value="car">Car</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="bicycle">Bicycle</option>
                                <option value="van">Van</option>
                                <option value="truck">Truck</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="vehicleModel">
                            <Form.Label>
                                Vehicle Model <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleModel"
                                value={vehicleData.vehicleModel}
                                onChange={handleChange}
                                placeholder="Enter vehicle model"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="vehicleNumber">
                            <Form.Label>
                                Vehicle Number <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleNumber"
                                value={vehicleData.vehicleNumber}
                                onChange={handleChange}
                                placeholder="Enter vehicle number"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="vehicleColor">
                            <Form.Label>Vehicle Color</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleColor"
                                value={vehicleData.vehicleColor}
                                onChange={handleChange}
                                placeholder="Enter vehicle color"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="vehicleYear">
                            <Form.Label>Vehicle Year</Form.Label>
                            <Form.Control
                                type="number"
                                name="vehicleYear"
                                value={vehicleData.vehicleYear}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                placeholder="Enter year of manufacture"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="vehicleInsurance">
                            <Form.Label>Vehicle Insurance</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleInsurance"
                                value={vehicleData.vehicleInsurance}
                                onChange={handleChange}
                                placeholder="Enter insurance details"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Group controlId="vehicleRegistration">
                            <Form.Label>Vehicle Registration</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleRegistration"
                                value={vehicleData.vehicleRegistration}
                                onChange={handleChange}
                                placeholder="Enter registration details"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit" className="px-4" disabled={saving}>
                        {saving ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default DriverVehicleInfo;
