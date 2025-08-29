import React, { useState, useEffect } from "react";
import {
  Card, Table, Spin, Alert, Statistic, Row, Col, Typography, Divider,
  Collapse, Tag, Button, Modal
} from "antd";
import {
  DollarOutlined, ShoppingOutlined, EyeOutlined
} from "@ant-design/icons";
import { axiosInstance } from "../../lib/axios";
import moment from "moment";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const FinanceReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/reports/finance", {
        params: {
          status: "out_for_delivery",
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

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <div className="flex pt-5 text-center bg-white">
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
      title: "Order Number",
      dataIndex: "order_number",
      key: "order_number",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => showOrderDetails(record)}
          icon={<EyeOutlined />}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => moment(date).format("MMM D, YYYY h:mm A"),
    },
    {
      title: "Items Count",
      dataIndex: "items",
      key: "items_count",
      render: (items) => items.length,
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (value) => <Text type="danger">Rs: {value.toFixed(2)}</Text>,
    },
    {
      title: "Total Income",
      dataIndex: "total_income",
      key: "total_income",
      render: (value) => <Text type="success">Rs: {value.toFixed(2)}</Text>,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value) => <Text strong>Rs: {value.toFixed(2)}</Text>,
    },
  ];

  // Order Details Modal Columns
  const orderDetailColumns = [
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Selling Price",
      dataIndex: "unit_price_of_product_selling",
      key: "unit_price_of_product_selling",
      render: (value) => `Rs: ${value.toFixed(2)}`,
    },
    {
      title: "Cost Price",
      dataIndex: "unit_price_of_product_cost",
      key: "unit_price_of_product_cost",
      render: (value) => `Rs: ${value.toFixed(2)}`,
    },
    {
      title: "Unit Profit",
      dataIndex: "unit_profit_of_product",
      key: "unit_profit_of_product",
      render: (value) => (
        <Tag color={value >= 0 ? "green" : "red"}>
          {value >= 0 ? "+" : ""}Rs: {value.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "Total Profit",
      dataIndex: "total_profit_for_products",
      key: "total_profit_for_products",
      render: (value) => (
        <Text strong type={value >= 0 ? "success" : "danger"}>
          {value >= 0 ? "+" : ""}Rs: {value.toFixed(2)}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ color: "#fff" }}>
        <DollarOutlined /> Finance Report
      </Title>

      <Divider />

      {/* Summary Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ borderRadius: 8, textAlign: "center" }}>
            <Statistic
              title="Total Orders"
              value={reportData.count}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ borderRadius: 8, textAlign: "center" }}>
            <Statistic
              title="Total Income"
              value={reportData.income?.total_income}
              precision={2}
              prefix="Rs: "
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable style={{ borderRadius: 8, textAlign: "center" }}>
            <Statistic
              title="Total Balance"
              value={reportData.total_balance}
              precision={2}
              prefix="Rs: "
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Income Breakdown */}
      <Collapse defaultActiveKey={['1']} style={{ marginBottom: "20px", background: '#fff' }}>
        <Panel header="Income Breakdown" key="1">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Delivery Charges"
                value={reportData.income.total_delivery_charges}
                precision={2}
                prefix="Rs: "
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Tax Charges"
                value={reportData.income.total_tax_charges}
                precision={2}
                prefix="Rs: "
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Product Profits"
                value={reportData.income.total_profits_from_products}
                precision={2}
                prefix="Rs: "
                valueStyle={{
                  color: reportData.income.total_profits_from_products >= 0 ? "#3f8600" : "#cf1322"
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="Total Income"
                value={reportData.income?.total_income}
                precision={2}
                prefix="Rs: "
                valueStyle={{ color: "#3f8600" }}
              />
            </Col>
          </Row>
        </Panel>
      </Collapse>

      {/* Orders Table */}
      <Card
        title={`Orders (${reportData.count})`}
        extra={
          <Text>
            Generated: {new Date().toLocaleString()}
          </Text>
        }
      >
        <Table
          columns={columns}
          dataSource={reportData.data || []}
          rowKey="order_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Order Details: ${selectedOrder?.order_number}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 70 }}
        bodyStyle={{ overflowX: "auto" }}
      >
        {selectedOrder && (
          <div style={{ overflowX: "auto" }}>
            <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
              <Col xs={24} md={12}>
                <Text strong>Order Date: </Text>
                {moment(selectedOrder.order_date).format("MMM D, YYYY h:mm A")}
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Warehouse: </Text>
                {selectedOrder.warehouse_id}
              </Col>
            </Row>

            <Table
              columns={orderDetailColumns}
              dataSource={selectedOrder.items}
              rowKey="product_id"
              pagination={false}
              size="small"
              scroll={{ x: "max-content" }}
            />

            <Divider />

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Statistic
                  title="Total Cost"
                  value={selectedOrder.total_cost}
                  precision={2}
                  prefix="Rs: "
                />
              </Col>
              <Col xs={24} md={12}>
                <Statistic
                  title="Total Income"
                  value={selectedOrder.total_income}
                  precision={2}
                  prefix="Rs: "
                />
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col span={24}>
                <Title level={5}>Income Breakdown</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Product Profit"
                      value={selectedOrder.income.profit_from_products}
                      precision={2}
                      prefix="Rs: "
                      valueStyle={{
                        color: selectedOrder.income.profit_from_products >= 0 ? "#3f8600" : "#cf1322"
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Delivery Fee"
                      value={selectedOrder.income.delivery_fee}
                      precision={2}
                      prefix="Rs: "
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Service Charge"
                      value={selectedOrder.income.service_charge}
                      precision={2}
                      prefix="Rs: "
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="Total Income"
                      value={selectedOrder.income.total_income}
                      precision={2}
                      prefix="Rs: "
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinanceReport;
