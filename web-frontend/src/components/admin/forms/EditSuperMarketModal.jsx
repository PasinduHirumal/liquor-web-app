// components/admin/forms/EditSuperMarketModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Switch, Button, message } from "antd";
import { axiosInstance } from "../../../lib/axios";

function EditSuperMarketModal({ open, onClose, marketData, onSuccess }) {
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (marketData) {
            form.setFieldsValue({
                superMarket_Name: marketData.superMarket_Name,
                streetAddress: marketData.streetAddress,
                city: marketData.city,
                state: marketData.state,
                postalCode: marketData.postalCode,
                country: marketData.country,
                isActive: marketData.isActive,
            });
        }
    }, [marketData, form]);

    const handleUpdate = async (values) => {
        try {
            setUpdating(true);
            const res = await axiosInstance.patch(`/superMarket/update/${marketData.id}`, values);
            if (res.data?.success) {
                message.success("Supermarket updated successfully");
                onClose();
                onSuccess();
            } else {
                message.error("Failed to update supermarket");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Server Error";
            message.error(errorMsg);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Modal
            title="Edit Supermarket"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" form={form} onFinish={handleUpdate}>
                <Form.Item
                    label="Name"
                    name="superMarket_Name"
                    rules={[{ required: true, message: 'Please enter supermarket name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Street Address"
                    name="streetAddress"
                    rules={[{ required: true, message: 'Please enter street address' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: 'Please enter city' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="State"
                    name="state"
                    rules={[{ required: true, message: 'Please enter state' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Postal Code"
                    name="postalCode"
                    rules={[{ required: true, message: 'Please enter postal code' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Country"
                    name="country"
                    rules={[{ required: true, message: 'Please enter country' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Active"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updating}>
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditSuperMarketModal;
