import React, { useState } from "react";
import { Modal, Form, Input, Switch, Button, message, Space } from "antd";
import { axiosInstance } from "../../../lib/axios";

function CreateSuperMarketModal({ open, onClose, onSuccess }) {
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = async (values) => {
        try {
            setCreating(true);
            const res = await axiosInstance.post("/superMarket/create", values);
            if (res.data?.success) {
                message.success("Supermarket created successfully");
                form.resetFields();
                onClose();
                onSuccess();
            } else {
                message.error("Failed to create supermarket");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Server Error";
            message.error(errorMsg);
        } finally {
            setCreating(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Create Supermarket"
            open={open}
            onCancel={handleCancel}
            footer={null}
            maskClosable={false}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleCreate}
            >
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
                    <Switch defaultChecked />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={creating}>
                            Create
                        </Button>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateSuperMarketModal;
