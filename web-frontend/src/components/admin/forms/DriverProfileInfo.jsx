import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import { Spinner, Form, Button, Row, Col, Card, Alert, Image } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import toast from "react-hot-toast";

const DriverProfileInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [driver, setDriver] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        nic_number: "",
        license_number: "",
        dateOfBirth: "",
        profileImage: "",
        address: "",
        city: "",
        emergencyContact: ""
    });

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const data = response.data.data;

                setDriver(data);
                setFormData({
                    email: data.email || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    phone: data.phone || "",
                    nic_number: data.nic_number || "",
                    license_number: data.license_number || "",
                    dateOfBirth: data.dateOfBirth || "",
                    profileImage: data.profileImage || "",
                    address: data.address || "",
                    city: data.city || "",
                    emergencyContact: data.emergencyContact || ""
                });
            } catch (error) {
                toast.error("Failed to fetch driver data");
            } finally {
                setLoading(false);
            }
        };

        fetchDriver();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await axiosInstance.patch(`/drivers/update/${id}`, formData);
            toast.success("Driver profile updated successfully");
            navigate(-1);
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to update driver";
            toast.error(msg);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="danger">Driver not found</Alert>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Row className="align-items-center mb-4">
                <Col xs="auto">
                    <Button variant="outline-primary px-2 py-1" onClick={() => navigate(-1)} className="p-0">
                        <ArrowLeft /> Back
                    </Button>
                </Col>
                <Col>
                    <h2 className="text-primary mb-0 text-start">Driver Profile Management</h2>
                </Col>
            </Row>

            <Row>
                {/* Left - Avatar and Basic Info */}
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <Image
                                src={formData.profileImage}
                                rounded
                                fluid
                                width={150}
                                height={150}
                                className="mb-3"
                            />
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label className="btn btn-outline-primary w-100">
                                    Upload New Image
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageUpload}
                                    />
                                </Form.Label>
                            </Form.Group>
                            <h5 className="fw-bold">{formData.firstName} {formData.lastName}</h5>
                            <hr />
                            <Form.Group className="mb-2">
                                <Form.Label>License Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right - Full Form */}
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <h5 className="mb-3 fw-bold">Personal Information</h5>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>NIC Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nic_number"
                                            value={formData.nic_number}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h5 className="mt-2 mb-3 fw-bold">Address Information</h5>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h5 className="mt-2 mb-3 fw-bold">Emergency Contact</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Emergency Contact</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="primary"
                                    onClick={handleUpdate}
                                    disabled={updating}
                                >
                                    {updating ? "Updating..." : "Update Profile"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DriverProfileInfo;
