import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, Row, Col } from 'antd';
import { axiosInstance } from '../../../lib/axios';
import toast from 'react-hot-toast';

const CreateSystemModal = ({ show, onHide, onCreateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/system/create', values);
            onCreateSuccess(response.data.data);
            form.resetFields();
            toast.success("Warehouse created successfully");
        } catch (error) {
            if (error.response?.data?.errors?.length > 0) {
                error.response.data.errors.forEach(err => {
                    toast.error(`${err.message}`);
                });
            } else {
                toast.error(error.response?.data?.message || 'Failed to create warehouse');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Warehouse"
            open={show} // ✅ updated from "visible" (deprecated) to "open"
            onCancel={onHide}
            maskClosable={false}
            afterClose={() => form.resetFields()}
            footer={[
                <Button key="back" onClick={onHide}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                >
                    Create
                </Button>,
            ]}
            width={700}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Warehouse Name */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="where_house_name"
                            label="Warehouse Name"
                            rules={[{ required: true, message: 'Please enter warehouse name!' }]}
                        >
                            <Input placeholder="Warehouse 1" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="delivery_charge_for_1KM"
                            label="Delivery Charge (per 1KM)"
                            initialValue={0.01}
                            rules={[{ required: true, message: 'Please input delivery charge!' }]}
                        >
                            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Address Field */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                { required: true, message: 'Please enter address!' },
                                { min: 2, max: 350, message: 'Address must be between 2 and 350 characters' }
                            ]}
                        >
                            <Input.TextArea placeholder="123 Main St, City, Country" rows={3} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Latitude / Longitude */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={['where_house_location', 'lat']}
                            label="Latitude"
                            rules={[
                                { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90' }
                            ]}
                        >
                            <InputNumber placeholder="Latitude" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={['where_house_location', 'lng']}
                            label="Longitude"
                            rules={[
                                { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180' }
                            ]}
                        >
                            <InputNumber placeholder="Longitude" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Service Charge & Status */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="service_charge"
                            label="Service Charge"
                            initialValue={0}
                            rules={[{ required: true, message: 'Please input service charge!' }]}
                        >
                            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="isActive"
                            label="Status"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateSystemModal;
