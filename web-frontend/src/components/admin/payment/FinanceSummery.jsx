import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Spin, Alert, Typography } from "antd";
import {
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    BankOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../../../lib/axios";

const { Title } = Typography;

function FinanceSummery() {
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
                <Spin size="large" tip="Loading driver report..." />
            </div>
        );
    }
    if (error) return <Alert type="error" message={error} className="mt-4" />;

    return (
        <div style={{ padding: "0 24px 24px 24px" }}>
            <Title level={3}>Driver Payments</Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Total Income"
                            value={summary.data.total_income}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Payment for Drivers"
                            value={summary.data.total_payment_for_drivers}
                            prefix={<ArrowDownOutlined />}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Company Withdrawals"
                            value={summary.data.total_company_withdraws}
                            prefix={<BankOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Available Balance"
                            value={summary.data.available_balance}
                            prefix={<WalletOutlined />}
                            valueStyle={{
                                color: summary.data.available_balance >= 0 ? "#3f8600" : "#cf1322",
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Amount to be Paid to Drivers"
                            value={summary.data.amount_to_be_paid_to_drivers}
                            prefix={<ArrowDownOutlined />}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Amount Can Withdraw"
                            value={summary.data.amount_can_withdraw}
                            prefix={<ArrowUpOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default FinanceSummery;
