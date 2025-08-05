import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, Row, Col, Spin, Typography, } from "antd";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const { Text } = Typography;

const EditSystemModal = ({ show, onHide, companyDetailId, onUpdateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (!show || !companyDetailId) return;

        const fetchData = async () => {
            setInitialLoading(true);
            try {
                const res = await axiosInstance.get("/system/details");
                const company = res.data.data;

                if (!company) {
                    toast.error("Company details not found");
                    onHide();
                    return;
                }

                form.setFieldsValue({
                    where_house_name: company.where_house_name || "",
                    where_house_location: company.where_house_location || { lat: "", lng: "" },
                    delivery_charge_for_1KM: company.delivery_charge_for_1KM ?? "",
                    service_charge: company.service_charge ?? "",
                    isActive: company.isActive ?? false,
                });
            } catch (err) {
                toast.error("Failed to load company details");
                onHide();
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [show, companyDetailId, form, onHide]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                where_house_name: values.where_house_name,
                where_house_location: {
                    lat: Number(values.where_house_location.lat),
                    lng: Number(values.where_house_location.lng),
                },
                delivery_charge_for_1KM: Number(values.delivery_charge_for_1KM),
                service_charge: Number(values.service_charge),
                isActive: values.isActive,
            };

            await axiosInstance.patch(`/system/update/${companyDetailId}`, payload);

            const res = await axiosInstance.get("/system/details");
            onUpdateSuccess(res.data.data);

            toast.success("System details updated successfully");
            onHide();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update system details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit System Details"
            visible={show}
            onCancel={() => !loading && onHide()}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={700}
            maskClosable={false}
            okText="Save Changes"
            cancelText="Cancel"
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
                >
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
                                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={["where_house_location", "lat"]}
                                label="Latitude"
                                rules={[
                                    { required: true, message: "Please input latitude!" },
                                    {
                                        type: "number",
                                        min: -90,
                                        max: 90,
                                        message: "Latitude must be between -90 and 90"
                                    }
                                ]}
                            >
                                <InputNumber placeholder="Latitude" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={["where_house_location", "lng"]}
                                label="Longitude"
                                rules={[
                                    { required: true, message: "Please input longitude!" },
                                    {
                                        type: "number",
                                        min: -180,
                                        max: 180,
                                        message: "Longitude must be between -180 and 180"
                                    }
                                ]}
                            >
                                <InputNumber placeholder="Longitude" style={{ width: "100%" }} />
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
                                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="isActive"
                                label="Status"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
        </Modal>
    );
};

export default EditSystemModal;
