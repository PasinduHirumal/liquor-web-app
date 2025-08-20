import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, message, Space } from "antd";
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
                lat: marketData.location?.lat || null,
                lng: marketData.location?.lng || null,
            });
        }
    }, [marketData, form]);

    const handleUpdate = async (values) => {
        try {
            setUpdating(true);

            const payload = {
                ...values,
                location: {
                    lat: values.lat || null,
                    lng: values.lng || null,
                },
            };

            const res = await axiosInstance.patch(`/superMarket/update/${marketData.id}`, payload);

            if (res.data?.success) {
                message.success("Supermarket updated successfully");
                onClose();
                onSuccess();
            } else {
                const errorMsg = res.data?.message || "Failed to update supermarket";
                message.error(errorMsg);
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                err.response.data.errors.forEach(e => {
                    message.error(`${e.field}: ${e.message}`);
                });
            } else {
                const errorMsg = err.response?.data?.message || "Server Error";
                message.error(errorMsg);
            }
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Modal
            title="Edit Supermarket"
            open={open}
            onCancel={() => { form.resetFields(); onClose(); }}
            footer={null}
            destroyOnClose
            maskClosable={false}
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

                {/* Location fields */}
                <Form.Item
                    label="Latitude"
                    name="lat"
                    rules={[{ type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Latitude" />
                </Form.Item>

                <Form.Item
                    label="Longitude"
                    name="lng"
                    rules={[{ type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Longitude" />
                </Form.Item>

                <Form.Item
                    label="Active"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={updating}>
                            Update
                        </Button>
                        <Button onClick={() => { form.resetFields(); onClose(); }}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditSuperMarketModal;
