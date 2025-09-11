import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Checkbox, Select, Row, Col, Spin } from "antd";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const { Option } = Select;

function AssignDriverModal({ show, handleClose, orderId }) {
    const [driverId, setDriverId] = useState("");
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driversLoading, setDriversLoading] = useState(false);

    const [filters, setFilters] = useState({
        isActive: false,
        isAvailable: false,
        isOnline: false,
        isDocumentVerified: false,
        backgroundCheckStatus: "",
    });

    useEffect(() => {
        if (show) fetchVerifiedDrivers();
    }, [show, filters]);

    const fetchVerifiedDrivers = async () => {
        setDriversLoading(true);
        try {
            const query = {
                ...(filters.isActive && { isActive: true }),
                ...(filters.isAvailable && { isAvailable: true }),
                ...(filters.isOnline && { isOnline: true }),
                ...(filters.isDocumentVerified && { isDocumentVerified: true }),
                ...(filters.backgroundCheckStatus && {
                    backgroundCheckStatus: filters.backgroundCheckStatus,
                }),
            };

            const res = await axiosInstance.get("/drivers/allDrivers", { params: query });
            setDrivers(res.data.data);
        } catch (err) {
            toast.error("Error fetching verified drivers");
        } finally {
            setDriversLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!driverId.trim()) {
            return toast.error("Please select a driver");
        }

        try {
            setLoading(true);
            const res = await axiosInstance.patch(
                `/orders/update-assigned_driver/${orderId}`,
                { assigned_driver_id: driverId }
            );
            toast.success(res.data.message || "Driver assigned successfully");
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to assign driver");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={show}
            title="Assign Driver"
            onCancel={handleClose}
            footer={[
                <Button key="cancel" onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>,
                <Button
                    key="assign"
                    type="primary"
                    onClick={handleAssign}
                    loading={loading}
                    disabled={driversLoading}
                >
                    Assign
                </Button>,
            ]}
            className="rounded-xl"
        >
            <Form layout="vertical" className="space-y-4">
                {/* Filters */}
                <Row gutter={[16, 8]}>
                    <Col xs={12} sm={8}>
                        <Checkbox
                            checked={filters.isActive}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isActive: e.target.checked }))}
                        >
                            Active
                        </Checkbox>
                    </Col>
                    <Col xs={12} sm={8}>
                        <Checkbox
                            checked={filters.isAvailable}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                        >
                            Available
                        </Checkbox>
                    </Col>
                    <Col xs={12} sm={8}>
                        <Checkbox
                            checked={filters.isOnline}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isOnline: e.target.checked }))}
                        >
                            Online
                        </Checkbox>
                    </Col>
                    <Col xs={12} sm={12}>
                        <Checkbox
                            checked={filters.isDocumentVerified}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isDocumentVerified: e.target.checked }))}
                        >
                            Doc Verified
                        </Checkbox>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Background Check Status" className="mb-2">
                            <Select
                                value={filters.backgroundCheckStatus}
                                onChange={(value) =>
                                    setFilters((prev) => ({ ...prev, backgroundCheckStatus: value }))
                                }
                                allowClear
                                placeholder="-- Any --"
                                className="w-full"
                            >
                                <Option value="">-- Any --</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Drivers Select */}
                {driversLoading ? (
                    <div className="flex justify-center items-center py-6">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Form.Item label="Select Verified Driver" className="mb-2">
                        <Select
                            value={driverId}
                            onChange={(val) => setDriverId(val)}
                            placeholder="-- Select Driver --"
                            className="w-full"
                            disabled={loading}
                            showSearch
                            optionFilterProp="children"
                        >
                            {drivers.map((driver) => (
                                <Option key={driver._id || driver.id} value={driver._id || driver.id}>
                                    {driver.firstName} {driver.lastName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}

export default AssignDriverModal;
