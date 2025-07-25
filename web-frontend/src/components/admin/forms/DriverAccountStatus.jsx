import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const DriverAccountStatus = ({ driverId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        role: "driver",
        googleId: "",
        isAvailable: false,
        isActive: false,
        isOnline: false,
        isDocumentVerified: false,
        backgroundCheckStatus: "pending",
    });

    // Fetch Account & Status data on mount
    useEffect(() => {
        const fetchAccountStatus = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${driverId}`);
                const data = response.data.data;

                setFormData({
                    role: data.role || "driver",
                    googleId: data.googleId || "",
                    isAvailable: data.isAvailable || false,
                    isActive: data.isActive || false,
                    isOnline: data.isOnline || false,
                    isDocumentVerified: data.isDocumentVerified || false,
                    backgroundCheckStatus: data.backgroundCheckStatus || "pending",
                });
            } catch (err) {
                setError("Failed to load account and status information");
            } finally {
                setLoading(false);
            }
        };

        fetchAccountStatus();
    }, [driverId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setError(null);
        try {
            const payload = { ...formData };
            await axiosInstance.patch(`/drivers/update/${driverId}`, payload);

            toast.success("Account & Status updated successfully");

            if (onClose) {
                onClose();
            }
            
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to update Account & Status";
            setError(msg);
            toast.error(msg);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-3">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="my-3">
                {error}
            </Alert>
        );
    }

    return (
        <div className="mb-4">
            <h5 className="mb-3 fw-bold">Account & Status</h5>
            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled
                        >
                            <option value="driver">Driver</option>
                            {/* Add more roles if your backend supports */}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={8}>
                    <Form.Group className="mb-3" controlId="formGoogleId">
                        <Form.Label>Google ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="googleId"
                            value={formData.googleId}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3" controlId="formIsAvailable">
                        <Form.Label>Is Available</Form.Label>
                        <Form.Check
                            type="switch"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3" controlId="formIsActive">
                        <Form.Label>Is Active</Form.Label>
                        <Form.Check
                            type="switch"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group className="mb-3" controlId="formIsOnline">
                        <Form.Label>Is Online</Form.Label>
                        <Form.Check
                            type="switch"
                            name="isOnline"
                            checked={formData.isOnline}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formIsDocumentVerified">
                        <Form.Label>Document Verified</Form.Label>
                        <Form.Check
                            type="switch"
                            name="isDocumentVerified"
                            checked={formData.isDocumentVerified}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBackgroundCheckStatus">
                        <Form.Label>Background Check Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="backgroundCheckStatus"
                            value={formData.backgroundCheckStatus}
                            onChange={handleChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleUpdate} disabled={updating}>
                    {updating ? "Updating..." : "Update Account & Status"}
                </Button>
            </div>
        </div>
    );
};

export default DriverAccountStatus;
