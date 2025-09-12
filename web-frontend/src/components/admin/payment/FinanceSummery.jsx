import React, { useEffect, useState } from "react";
import { Card, Spin, Alert, Statistic, Row, Col, Typography, Divider, Collapse } from "antd";
import {
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    BankOutlined,
    WalletOutlined,
    PercentageOutlined,
    ShoppingCartOutlined,
    CarOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../../../lib/axios";

const { Title, Text } = Typography;
const { Panel } = Collapse;

function FinanceSummary() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
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
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[100px] bg-white">
                <Spin size="large" tip="Loading finance summary..." />
            </div>
        );
    }
    if (error) return <Alert type="error" message={error} className="mt-4" />;

    const data = summary?.data || {};

    return (
        <div className="p-6">
            <Title level={3}>Finance Summary</Title>
            {summary.filtered && (
                <Text type="secondary" className="block mb-4">
                    Filtered by: {summary.filtered}
                </Text>
            )}

            {/* Income + Income Breakdown */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={24} md={12}>
                    <Collapse defaultActiveKey={['1']} style={{ background: '#fff' }}>
                        <Panel header="Income" key="1">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Tax</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_tax.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Service Charges</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_service_charge.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Profit From Product</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_profit_from_products.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Delivery Fee</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600" }}>
                                        Rs: {data.total_delivery_fee.toFixed(2)}
                                    </Text>
                                </Row>

                                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Income</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600", fontWeight: "bold" }}>
                                        Rs: {data.total_income.toFixed(2)}
                                    </Text>
                                </Row>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>

                <Col xs={24} md={12}>
                    <Collapse defaultActiveKey={['1']} style={{ background: '#fff' }}>
                        <Panel header="Available" key="1">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Income</Text>
                                    <Text style={{ fontSize: 14 }}>
                                        Rs: {data.total_income.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Payment For Drivers</Text>
                                    <Text style={{ fontSize: 14, color: "#cf1322" }}>
                                        Rs: {data.total_payment_for_drivers.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Total Company Withdraws</Text>
                                    <Text style={{ fontSize: 14, color: "#cf1322" }}>
                                        Rs: {data.total_company_withdraws.toFixed(2)}
                                    </Text>
                                </Row>

                                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Available Balance</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600", fontWeight: "bold" }}>
                                        Rs: {data.available_balance.toFixed(2)}
                                    </Text>
                                </Row>
                            </div>
                        </Panel>
                    </Collapse>
                </Col>

                <Col xs={24} md={12}>
                    <Collapse defaultActiveKey={['1']} style={{ background: '#fff' }}>
                        <Panel header="Withdrawable" key="1">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Available Balance</Text>
                                    <Text style={{ fontSize: 14 }}>
                                        Rs: {data.available_balance.toFixed(2)}
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Amount To be Paid To Drivers</Text>
                                    <Text style={{ fontSize: 14, color: "#cf1322" }}>
                                        Rs: {data.amount_to_be_paid_to_drivers.toFixed(2)}
                                    </Text>
                                </Row>

                                <Divider style={{ margin: "0", borderTop: "2px solid #000" }} />

                                <Row justify="space-between">
                                    <Text strong style={{ fontSize: 14 }}>Amount Can Withdraw</Text>
                                    <Text style={{ fontSize: 14, color: "#3f8600", fontWeight: "bold" }}>
                                        Rs: {data.amount_can_withdraw.toFixed(2)}
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
