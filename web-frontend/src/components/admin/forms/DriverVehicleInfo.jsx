import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

function DriverVehicleInfo() {
    const { id } = useParams(); // Driver ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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
        try {
            await axiosInstance.patch(`/drivers/update-vehicleInfo/${id}`, vehicleData);
            toast.success("Vehicle info updated successfully!");
            navigate(-1)
        } catch (err) {
            const message = err.response?.data?.error || "Update failed";
            toast.error(message);
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
            <Row className="mb-3 align-items-center">
                <Col>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        ← Back
                    </Button>
                </Col>
                <Col className="text-end">
                    <h4 className="text-primary m-0">Edit Vehicle Information</h4>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Select
                                name="vehicleType"
                                value={vehicleData.vehicleType}
                                onChange={handleChange}
                                required
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
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Model</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleModel"
                                value={vehicleData.vehicleModel}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleNumber"
                                value={vehicleData.vehicleNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Color</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleColor"
                                value={vehicleData.vehicleColor}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Year</Form.Label>
                            <Form.Control
                                type="number"
                                name="vehicleYear"
                                value={vehicleData.vehicleYear}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Insurance</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleInsurance"
                                value={vehicleData.vehicleInsurance}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vehicle Registration</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleRegistration"
                                value={vehicleData.vehicleRegistration}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}

export default DriverVehicleInfo;
