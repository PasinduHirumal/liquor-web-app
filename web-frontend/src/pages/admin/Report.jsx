import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { Card, Table, Spin, Alert, Statistic, Row, Col, Typography, Divider } from "antd";

const { Title, Text } = Typography;

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/reports/finance", {
          params: {
            // Optional filters
            status: "out_for_delivery",
            // start_date: "2025-01-01",
            // end_date: "2025-08-27",
          },
        });

        setReportData(response.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err.response?.data?.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!reportData) {
    return <Alert message="No report data available." type="info" showIcon />;
  }

  // Table Columns for Orders
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      ellipsis: true,
    },
    {
      title: "Order Number",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse_id",
      key: "warehouse_id",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value) => <Text strong>${value.toFixed(2)}</Text>,
    },
    {
      title: "Total Income",
      dataIndex: "total_income",
      key: "total_income",
      render: (value) => <Text type="success">${value.toFixed(2)}</Text>,
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (value) => <Text type="danger">${value.toFixed(2)}</Text>,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} className="text-white">Finance Report</Title>
      <Text type="secondary">{reportData.message}</Text>
      {reportData.filtered && (
        <Alert
          message={`Filters Applied: ${reportData.filtered}`}
          type="info"
          showIcon
          style={{ marginTop: "10px" }}
        />
      )}

      <Divider />

      {/* Income Summary */}
      <Card title="Income Summary" style={{ marginBottom: "20px" }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Total Delivery Charges"
              value={reportData.income?.total_delivery_charges || 0}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Tax Charges"
              value={reportData.income?.total_tax_charges || 0}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Profits from Products"
              value={reportData.income?.total_profits_from_products || 0}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Income"
              value={reportData.income?.total_income || 0}
              precision={2}
            />
          </Col>
        </Row>
      </Card>

      {/* Total Balance */}
      <Card style={{ marginBottom: "20px" }}>
        <Statistic
          title="Total Balance"
          value={reportData.total_balance || 0}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
        />
      </Card>

      {/* Orders Table */}
      <Card title="Orders">
        <Table
          columns={columns}
          dataSource={reportData.data || []}
          rowKey="order_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Report;
