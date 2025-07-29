import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const ORDER_STATUSES = {
    PENDING: "pending",
    PROCESSING: "processing",
};

function EditStatusModal({ show, handleClose, orderId }) {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!status) return toast.error("Please select a status");

        try {
            setLoading(true);
            await axiosInstance.patch(`/orders/update-status/${orderId}`, {
                status,
            });
            toast.success("Order status updated successfully");
            handleClose();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update order status";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="mt-5 pt-5">
            <Modal.Header closeButton>
                <Modal.Title>Edit Order Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value={ORDER_STATUSES.PENDING}>Pending</option>
                        <option value={ORDER_STATUSES.PROCESSING}>Processing</option>
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditStatusModal;
