import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

function AssignDriverModal({ show, handleClose, orderId }) {
    const [driverId, setDriverId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        if (!driverId.trim()) {
            return toast.error("Driver ID is required");
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
                <Form.Group controlId="driverId">
                    <Form.Label>Driver ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter driver ID"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleAssign} disabled={loading}>
                    {loading ? "Assigning..." : "Assign"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AssignDriverModal;
