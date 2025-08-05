import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, Row, Col, Typography } from 'antd';
import { axiosInstance } from '../../../lib/axios';
import toast from 'react-hot-toast';

const { Text } = Typography;

const CreateSystemModal = ({ show, onHide, onCreateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/system/create', values);
            onCreateSuccess(response.data.data);
            form.resetFields();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create system configuration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create System Configuration"
            visible={show}
            onCancel={onHide}
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
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="where_house_name"
                            label="Warehouse Name"
                            rules={[
                                { required: true, message: 'Please input warehouse name!' },
                                {
                                    pattern: /^where_house_\d+$/,
                                    message: 'Must follow format "where_house_" followed by a number'
                                }
                            ]}
                        >
                            <Input placeholder="where_house_1" />
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

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={['where_house_location', 'lat']}
                            label="Latitude"
                            rules={[
                                { required: false },
                                {
                                    type: 'number',
                                    min: -90,
                                    max: 90,
                                    message: 'Latitude must be between -90 and 90'
                                }
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
                                { required: false },
                                {
                                    type: 'number',
                                    min: -180,
                                    max: 180,
                                    message: 'Longitude must be between -180 and 180'
                                }
                            ]}
                        >
                            <InputNumber placeholder="Longitude" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

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