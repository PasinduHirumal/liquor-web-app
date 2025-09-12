import React, { useEffect, useState } from "react";
import {
    Card,
    Statistic,
    Row,
    Col,
    Spin,
    Alert,
    Typography,
    Collapse,
} from "antd";
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

            {/* --- Always Visible Top 3 --- */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Total Income"
                            value={data.total_income}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Total Tax"
                            value={data.total_tax}
                            prefix={<PercentageOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Service Charges"
                            value={data.total_service_charge}
                            prefix={<BankOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Profit from Products"
                            value={data.total_profit_from_products}
                            prefix={<ShoppingCartOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Delivery Fees"
                            value={data.total_delivery_fee}
                            prefix={<CarOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Payment for Drivers"
                            value={data.total_payment_for_drivers}
                            prefix={<ArrowDownOutlined />}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Company Withdrawals"
                            value={data.total_company_withdraws}
                            prefix={<BankOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Available Balance"
                            value={data.available_balance}
                            prefix={<WalletOutlined />}
                            precision={2}
                            valueStyle={{
                                color: data.available_balance >= 0 ? "#3f8600" : "#cf1322",
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Amount to be Paid to Drivers"
                            value={data.amount_to_be_paid_to_drivers}
                            prefix={<ArrowDownOutlined />}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card className="shadow rounded-2xl">
                        <Statistic
                            title="Amount Can Withdraw"
                            value={data.amount_can_withdraw}
                            prefix={<ArrowUpOutlined />}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default FinanceSummary;
