import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, Row, Col, Spin, Typography } from "antd";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const { Text } = Typography;

const EditSystemModal = ({ show, onHide, companyDetailId, onUpdateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    useEffect(() => {
        if (!show || !companyDetailId) return;

        const fetchData = async () => {
            setInitialLoading(true);
            try {
                // First get all company details
                const res = await axiosInstance.get("/system/details");
                const allDetails = res.data.data;

                // Find the specific record we want to edit
                const recordToEdit = allDetails.find(item => item.id === companyDetailId);

                if (!recordToEdit) {
                    toast.error("Warehouse details not found");
                    onHide();
                    return;
                }

                setCurrentRecord(recordToEdit);

                // Set form values
                form.setFieldsValue({
                    where_house_name: recordToEdit.where_house_name || "",
                    where_house_location: recordToEdit.where_house_location || { lat: "", lng: "" },
                    delivery_charge_for_1KM: recordToEdit.delivery_charge_for_1KM ?? "",
                    service_charge: recordToEdit.service_charge ?? "",
                    isActive: recordToEdit.isActive ?? false,
                });
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load warehouse details");
                onHide();
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();

        // Cleanup function to reset form when modal closes
        return () => {
            form.resetFields();
            setCurrentRecord(null);
        };
    }, [show, companyDetailId, form, onHide]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                where_house_name: values.where_house_name,
                where_house_location: {
                    lat: values.where_house_location.lat ? Number(values.where_house_location.lat) : null,
                    lng: values.where_house_location.lng ? Number(values.where_house_location.lng) : null,
                },
                delivery_charge_for_1KM: Number(values.delivery_charge_for_1KM),
                service_charge: Number(values.service_charge),
                isActive: values.isActive,
            };

            // Update the specific record
            const response = await axiosInstance.patch(
                `/system/update/${companyDetailId}`,
                payload
            );

            // Call the success handler with updated data
            onUpdateSuccess({
                ...currentRecord,
                ...payload,
                id: companyDetailId,
                updated_at: new Date().toISOString()
            });

            toast.success("Warehouse details updated successfully");
            onHide();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update warehouse details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Edit Warehouse: ${currentRecord?.where_house_name || ''}`}
            visible={show}
            onCancel={() => !loading && onHide()}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={700}
            maskClosable={false}
            okText="Save Changes"
            cancelText="Cancel"
            destroyOnClose
        >
            {initialLoading ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={currentRecord || {}}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Text strong style={{ display: 'block', marginBottom: 16 }}>
                                Warehouse Code: {currentRecord?.where_house_code || 'N/A'}
                            </Text>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="where_house_name"
                                label="Warehouse Name"
                                rules={[
                                    { required: true, message: "Please input warehouse name!" },
                                    {
                                        pattern: /^where_house_\d+$/,
                                        message: "Format must be 'where_house_' followed by a number"
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
                                rules={[{ required: true, message: "Please input delivery charge!" }]}
                            >
                                <InputNumber
                                    min={0.01}
                                    step={0.01}
                                    style={{ width: "100%" }}
                                    formatter={value => `Rs: ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={["where_house_location", "lat"]}
                                label="Latitude"
                                rules={[
                                    { required: false, message: "Please input latitude!" },
                                    {
                                        type: "number",
                                        min: -90,
                                        max: 90,
                                        message: "Latitude must be between -90 and 90"
                                    }
                                ]}
                            >
                                <InputNumber
                                    placeholder="Latitude"
                                    style={{ width: "100%" }}
                                    precision={6}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={["where_house_location", "lng"]}
                                label="Longitude"
                                rules={[
                                    { required: false, message: "Please input longitude!" },
                                    {
                                        type: "number",
                                        min: -180,
                                        max: 180,
                                        message: "Longitude must be between -180 and 180"
                                    }
                                ]}
                            >
                                <InputNumber
                                    placeholder="Longitude"
                                    style={{ width: "100%" }}
                                    precision={6}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="service_charge"
                                label="Service Charge"
                                rules={[{ required: true, message: "Please input service charge!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    step={0.01}
                                    style={{ width: "100%" }}
                                    formatter={value => `Rs: ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="isActive"
                                label="Status"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                    style={{ marginTop: 6 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
        </Modal>
    );
};

export default EditSystemModal;