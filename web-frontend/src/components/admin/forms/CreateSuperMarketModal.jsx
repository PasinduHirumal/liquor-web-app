import React, { useState } from "react";
import { Modal, Form, Input, Switch, Button, message, Space, InputNumber } from "antd";
import { axiosInstance } from "../../../lib/axios";

function CreateSuperMarketModal({ open, onClose, onSuccess }) {
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = async (values) => {
        try {
            setCreating(true);

            // Include location object
            const payload = {
                ...values,
                location: {
                    lat: values.lat || null,
                    lng: values.lng || null,
                },
            };

            const res = await axiosInstance.post("/superMarket/create", payload);

            if (res.data?.success) {
                message.success("Supermarket created successfully");
                form.resetFields();
                onClose();
                onSuccess();
            } else {
                const errorMsg = res.data?.message || "Failed to create supermarket";
                message.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Server Error";

            // Show backend validation errors if available
            if (err.response?.data?.errors) {
                err.response.data.errors.forEach(e => {
                    message.error(`${e.field}: ${e.message}`);
                });
            } else {
                message.error(errorMsg);
            }
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

                {/* Location fields */}
                <Form.Item label="Latitude" name="lat" rules={[
                    { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90' }
                ]}>
                    <InputNumber style={{ width: '100%' }} placeholder="Latitude" />
                </Form.Item>

                <Form.Item label="Longitude" name="lng" rules={[
                    { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180' }
                ]}>
                    <InputNumber style={{ width: '100%' }} placeholder="Longitude" />
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
