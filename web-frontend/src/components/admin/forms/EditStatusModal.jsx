import React, { useState } from "react";
import { Modal, Button, Form, Select } from "antd";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const { Option } = Select;

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
            await axiosInstance.patch(`/orders/update-status/${orderId}`, { status });
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
        <Modal
            open={show}
            title="Edit Order Status"
            onCancel={handleClose}
            footer={[
                <Button key="cancel" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>,
                <Button
                    key="update"
                    type="primary"
                    onClick={handleUpdate}
                    loading={loading}
                >
                    Update
                </Button>,
            ]}
            className="rounded-xl"
        >
            <Form layout="vertical" className="space-y-4">
                <Form.Item label="Status" required>
                    <Select
                        value={status}
                        onChange={(val) => setStatus(val)}
                        placeholder="Select Status"
                        className="w-full"
                    >
                        <Option value={ORDER_STATUSES.PENDING}>Pending</Option>
                        <Option value={ORDER_STATUSES.PROCESSING}>Processing</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditStatusModal;
