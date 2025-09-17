import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Card, Spin, Alert, Statistic, Row, Col, Typography, Divider,
    Collapse, Button
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../../lib/axios";

const { Title, Text } = Typography;
const { Panel } = Collapse;

function FinanceSummary() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchSummary = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get("/finance/summery");
            if (res.data.success) {
                setSummary(res.data);
            } else {
                setError(res.data.message || "Failed to fetch finance summary");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (!summary && loading) {
        return (
            <div className="flex items-center justify-center min-h-[100px] bg-white">
                <Spin size="large" tip="Loading finance summary..." />
            </div>
        );
    }

    if (!summary && error) return <Alert type="error" message={error} className="mt-4" />;

    const data = summary?.data || {};

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex flex-col">
                    <Title level={3} className="mb-1">Finance Summary</Title>
                    {summary?.filtered && (
                        <Text type="secondary" className="text-sm">
                            Filtered by: {summary.filtered}
                        </Text>
                    )}
                </div>

                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={loading}
                    onClick={() => {
                        fetchSummary();
                        toast.success("Finance summary refreshed");
                    }}
                >
                    Refresh
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12} md={6}>
                    <Card hoverable style={{ borderRadius: 8, textAlign: "center" }}>
                        <Statistic
                            title="Amount Can Withdraw"
                            value={data.amount_can_withdraw}
                            precision={2}
                            prefix="Rs: "
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Income + Available + Withdrawable */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                {/* Income Panel */}
                <Col xs={24} md={12}>
                    <Collapse defaultActiveKey={[]} style={{ background: '#fff' }}>
                        <Panel
                            key="1"
                            header={
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <span>Income</span>
                                    <span style={{ fontWeight: 'bold', color: '#3f8600' }}>
                                        Rs: {data.total_income?.toFixed(2)}
                                    </span>
                                </div>
                            }
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Tax</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_tax?.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Service Charges</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_service_charge?.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Profit From Product</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_profit_from_products?.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Delivery Fee</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_delivery_fee?.toFixed(2)}
                                    </Text>
                                </Row>

                                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Income</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600", fontWeight: "bold" }}>
                                        Rs: {data.total_income?.toFixed(2)}
                                    </Text>
                                </Row>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>

                {/* Available Panel */}
                <Col xs={24} md={12}>
                    <Collapse defaultActiveKey={[]} style={{ background: '#fff' }}>

                        <Panel
                            key="1"
                            header={
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <span>Available</span>
                                    <span style={{ fontWeight: 'bold', color: '#3f8600' }}>
                                        Rs: {data.available_balance?.toFixed(2)}
                                    </span>
                                </div>
                            }
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Income</Text>
                                    <Text style={{ fontSize: 14 }}>
                                        Rs: {data.total_income?.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Payment For Drivers</Text>
                                    <Text style={{ fontSize: 14, color: "#cf1322" }}>
                                        Rs: {data.total_payment_for_drivers?.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Company Withdraws</Text>
                                    <Text style={{ fontSize: 14, color: "#cf1322" }}>
                                        Rs: {data.total_company_withdraws?.toFixed(2)}
                                    </Text>
                                </Row>

                                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Available Balance</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600", fontWeight: "bold" }}>
                                        Rs: {data.available_balance?.toFixed(2)}
                                    </Text>
                                </Row>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>

                {/* Withdrawable Panel */}
                <Col xs={24} md={12}>
                    <Collapse defaultActiveKey={[]} style={{ background: '#fff' }}>
                        <Panel
                            key="1"
                            header={
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <span>Withdrawable</span>
                                    <span style={{ fontWeight: 'bold', color: '#3f8600' }}>
                                        Rs: {data.amount_can_withdraw?.toFixed(2)}
                                    </span>
                                </div>
                            }
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Available Balance</Text>
                                    <Text style={{ fontSize: 14 }}>
                                        Rs: {data.available_balance?.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Amount To be Paid To Drivers</Text>
                                    <Text style={{ fontSize: 14, color: "#cf1322" }}>
                                        Rs: {data.amount_to_be_paid_to_drivers?.toFixed(2)}
                                    </Text>
                                </Row>

                                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Amount Can Withdraw</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600", fontWeight: "bold" }}>
                                        Rs: {data.amount_can_withdraw?.toFixed(2)}
                                    </Text>
                                </Row>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </div>
    );
}

export default FinanceSummary;
