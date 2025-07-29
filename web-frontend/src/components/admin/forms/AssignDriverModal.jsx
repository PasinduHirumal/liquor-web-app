import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

function AssignDriverModal({ show, handleClose, orderId }) {
    const [driverId, setDriverId] = useState("");
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driversLoading, setDriversLoading] = useState(false);

    useEffect(() => {
        if (show) fetchVerifiedDrivers();
    }, [show]);

    const fetchVerifiedDrivers = async () => {
        setDriversLoading(true);
        try {
            const res = await axiosInstance.get("/drivers/allDrivers");
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

    return (
        <Modal show={show} onHide={handleClose} className="mt-5 pt-5">
            <Modal.Header closeButton>
                <Modal.Title>Assign Driver</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                <option key={driver.id} value={driver.id}>
                                    {driver.firstName} {driver.lastName}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}
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
