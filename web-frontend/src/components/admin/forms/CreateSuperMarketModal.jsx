import React, { useState } from "react";
import { Modal, Form, Input, Switch, Button, message, Space, Row, Col, InputNumber } from "antd";
import { axiosInstance } from "../../../lib/axios";

function CreateSuperMarketModal({ open, onClose, onSuccess }) {
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm();

    const handleCreate = async (values) => {
        try {
            setCreating(true);

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
            if (err.response?.data?.errors) {
                err.response.data.errors.forEach(e => {
                    message.error(`${e.field}: ${e.message}`);
                });
            } else {
                const errorMsg = err.response?.data?.message || "Server Error";
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
            destroyOnClose
            maskClosable={false}
            width={700}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleCreate}
                scrollToFirstError
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="superMarket_Name"
                            rules={[{ required: true, message: 'Please enter supermarket name' }]}
                        >
                            <Input placeholder="Enter supermarket name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please enter country' }]}
                        >
                            <Input placeholder="Enter country" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Street Address"
                    name="streetAddress"
                    rules={[{ required: true, message: 'Please enter street address' }]}
                >
                    <Input.TextArea
                        placeholder="Enter full street address"
                        rows={2}
                        autoSize={{ minRows: 2, maxRows: 3 }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please enter city' }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: 'Please enter state' }]}
                        >
                            <Input placeholder="Enter state" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Postal Code"
                            name="postalCode"
                            rules={[{ required: true, message: 'Please enter postal code' }]}
                        >
                            <Input placeholder="Enter postal code" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Latitude"
                            name="lat"
                            rules={[
                                { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Latitude (-90 to 90)"
                                precision={6}
                                step={0.000001}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Longitude"
                            name="lng"
                            rules={[
                                { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Longitude (-180 to 180)"
                                precision={6}
                                step={0.000001}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Status"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel} disabled={creating}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={creating}>
                            Create Supermarket
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CreateSuperMarketModal;
