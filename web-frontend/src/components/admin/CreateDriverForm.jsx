import React from 'react';
import { Modal, Form, Input, DatePicker, Row, Col } from 'antd';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const CreateDriverModal = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();

    const handleCreateDriver = async (values) => {
        try {
            await axiosInstance.post('/drivers/createDriver', values);
            toast.success('Driver created successfully');
            form.resetFields();
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create driver');
        }
    };

    return (
        <Modal
            title="Create New Driver"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Create"
            width={700}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateDriver}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                            <Input placeholder="+6591234567" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="nic_number" label="NIC Number" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="license_number" label="License Number" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateDriverModal;
