import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

function AssignDriverModal({ show, handleClose, orderId }) {
    const [driverId, setDriverId] = useState("");
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driversLoading, setDriversLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        isActive: false,
        isAvailable: false,
        isOnline: false,
        isDocumentVerified: false,
        backgroundCheckStatus: "",
    });

    useEffect(() => {
        if (show) fetchVerifiedDrivers();
    }, [show, filters]);

    const fetchVerifiedDrivers = async () => {
        setDriversLoading(true);
        try {
            const query = {
                ...(filters.isActive && { isActive: true }),
                ...(filters.isAvailable && { isAvailable: true }),
                ...(filters.isOnline && { isOnline: true }),
                ...(filters.isDocumentVerified && { isDocumentVerified: true }),
                ...(filters.backgroundCheckStatus && {
                    backgroundCheckStatus: filters.backgroundCheckStatus,
                }),
            };

            const res = await axiosInstance.get("/drivers/allDrivers", {
                params: query,
            });
            setDrivers(res.data.data);
        } catch (err) {
            toast.error("Error fetching verified drivers");
        } finally {
            setDriversLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!driverId.trim()) {
            return toast.error("Please select a driver");
        }

        try {
            setLoading(true);
            const res = await axiosInstance.patch(`/orders/update-assigned_driver/${orderId}`, {
                assigned_driver_id: driverId,
            });
            toast.success(res.data.message || "Driver assigned successfully");
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to assign driver");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <Modal show={show} onHide={handleClose} className="mt-5 pt-5">
            <Modal.Header closeButton>
                <Modal.Title>Assign Driver</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col xs={6} sm={4}>
                            <Form.Check
                                type="checkbox"
                                label="Active"
                                name="isActive"
                                checked={filters.isActive}
                                onChange={handleFilterChange}
                            />
                        </Col>
                        <Col xs={6} sm={4}>
                            <Form.Check
                                type="checkbox"
                                label="Available"
                                name="isAvailable"
                                checked={filters.isAvailable}
                                onChange={handleFilterChange}
                            />
                        </Col>
                        <Col xs={6} sm={4}>
                            <Form.Check
                                type="checkbox"
                                label="Online"
                                name="isOnline"
                                checked={filters.isOnline}
                                onChange={handleFilterChange}
                            />
                        </Col>
                        <Col xs={6} sm={6}>
                            <Form.Check
                                type="checkbox"
                                label="Doc Verified"
                                name="isDocumentVerified"
                                checked={filters.isDocumentVerified}
                                onChange={handleFilterChange}
                            />
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="backgroundCheckStatus">
                                <Form.Label>Background Check Status</Form.Label>
                                <Form.Select
                                    name="backgroundCheckStatus"
                                    value={filters.backgroundCheckStatus}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            backgroundCheckStatus: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">-- Any --</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {driversLoading ? (
                        <div className="d-flex justify-content-center align-items-center py-4">
                            <Spinner animation="border" role="status" />
                        </div>
                    ) : (
                        <Form.Group controlId="driverId">
                            <Form.Label>Select Verified Driver</Form.Label>
                            <Form.Select
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">-- Select Driver --</option>
                                {drivers.map((driver) => (
                                    <option key={driver._id || driver.id} value={driver._id || driver.id}>
                                        {driver.firstName} {driver.lastName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleAssign} disabled={loading || driversLoading}>
                    {loading ? "Assigning..." : "Assign"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AssignDriverModal;
