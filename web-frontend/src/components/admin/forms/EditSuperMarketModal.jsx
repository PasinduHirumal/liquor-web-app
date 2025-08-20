import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, message, Space, Row, Col } from "antd";
import { axiosInstance } from "../../../lib/axios";

function EditSuperMarketModal({ open, onClose, marketData, onSuccess }) {
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (marketData && open) {
            const location = marketData.location || {};
            form.setFieldsValue({
                superMarket_Name: marketData.superMarket_Name || "",
                streetAddress: marketData.streetAddress || "",
                city: marketData.city || "",
                state: marketData.state || "",
                postalCode: marketData.postalCode || "",
                country: marketData.country || "",
                isActive: marketData.isActive !== undefined ? marketData.isActive : true,
                lat: location.lat ?? null,
                lng: location.lng ?? null,
            });
        }
    }, [marketData, form, open]);

    const handleUpdate = async (values) => {
        try {
            setUpdating(true);

            // Merge latitude and longitude into location object
            const payload = {
                superMarket_Name: values.superMarket_Name,
                streetAddress: values.streetAddress,
                city: values.city,
                state: values.state,
                postalCode: values.postalCode,
                country: values.country,
                isActive: values.isActive,
                location: {
                    ...(values.lat !== undefined && values.lat !== null ? { lat: values.lat } : {}),
                    ...(values.lng !== undefined && values.lng !== null ? { lng: values.lng } : {}),
                },
            };

            // Remove empty objects or fields to avoid validation issues
            if (Object.keys(payload.location).length === 0) delete payload.location;
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
                    delete payload[key];
                }
            });

            const res = await axiosInstance.patch(`/superMarket/update/${marketData.id}`, payload);

            if (res.data?.success) {
                message.success("Supermarket updated successfully");
                form.resetFields();
                onClose();
                onSuccess();
            } else {
                const errorMsg = res.data?.message || "Failed to update supermarket";
                message.error(errorMsg);
            }
        } catch (err) {
            console.error("Update error:", err);

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

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Edit Supermarket"
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
                onFinish={handleUpdate}
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
                                {
                                    type: 'number',
                                    min: -90,
                                    max: 90,
                                    message: 'Latitude must be between -90 and 90'
                                }
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
                                {
                                    type: 'number',
                                    min: -180,
                                    max: 180,
                                    message: 'Longitude must be between -180 and 180'
                                }
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
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel} disabled={updating}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={updating}>
                            Update Supermarket
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditSuperMarketModal;
