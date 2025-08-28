import React, { useState, useEffect } from "react";
import {
  Card, Table, Spin, Alert, Statistic, Row, Col, Typography, Divider,
  Collapse, Tag, Button, DatePicker, Select, Space, Modal
} from "antd";
import {
  DollarOutlined, ShoppingOutlined, FilePdfOutlined, DownloadOutlined, EyeOutlined
} from "@ant-design/icons";
import { axiosInstance } from "../../lib/axios";
import moment from "moment";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

const FinanceReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "out_for_delivery",
    start_date: null,
    end_date: null
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/reports/finance", {
        params: {
          status: filters.status,
          ...params
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFilters(prev => ({
        ...prev,
        start_date: dates[0].format("YYYY-MM-DD"),
        end_date: dates[1].format("YYYY-MM-DD")
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        start_date: null,
        end_date: null
      }));
    }
  };

  const applyFilters = () => {
    const params = {};
    if (filters.start_date && filters.end_date) {
      params.start_date = filters.start_date;
      params.end_date = filters.end_date;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    fetchReport(params);
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

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
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (value) => <Text strong>Rs: {value.toFixed(2)}</Text>,
    },
    {
      title: "Total Income",
      dataIndex: "total_income",
      key: "total_income",
      render: (value) => <Text type="success">Rs: {value.toFixed(2)}</Text>,
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (value) => <Text type="danger">Rs: {value.toFixed(2)}</Text>,
    },
    {
      title: "Profit/Loss",
      key: "profit_loss",
      render: (_, record) => {
        const profit = record.total_income - record.total_cost;
        const isProfit = profit >= 0;
        return (
          <Tag color={isProfit ? "green" : "red"}>
            {isProfit ? "+" : ""}Rs: {profit.toFixed(2)}
          </Tag>
        );
      },
    },
  ];

  // Order Details Modal
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

      {/* Filters Section */}
      <Card style={{ marginBottom: "20px" }}>
        <Title level={5}>Filters</Title>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Space>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: 200 }}
            >
              <Option value="out_for_delivery">Out for Delivery</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>

            <RangePicker
              onChange={handleDateRangeChange}
              style={{ width: 300 }}
            />

            <Button type="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
          </Space>

          {reportData.filtered && (
            <Alert
              message={`Filters Applied: ${reportData.filtered}`}
              type="info"
              showIcon
            />
          )}
        </Space>
      </Card>

      <Divider />

      {/* Summary Section */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={reportData.count}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Income"
              value={reportData.income?.total_income || 0}
              precision={2}
              prefix="Rs: "
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value={reportData.total_balance || 0}
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
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Delivery Charges"
                value={reportData.income?.total_delivery_charges || 0}
                precision={2}
                prefix="Rs: "
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tax Charges"
                value={reportData.income?.total_tax_charges || 0}
                precision={2}
                prefix="Rs: "
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Product Profits"
                value={reportData.income?.total_profits_from_products || 0}
                precision={2}
                prefix="Rs: "
                valueStyle={{
                  color: reportData.income?.total_profits_from_products >= 0 ? "#3f8600" : "#cf1322"
                }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Total Income"
                value={reportData.income?.total_income || 0}
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
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Order Details: ${selectedOrder?.order_number}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col span={12}>
                <Text strong>Order Date: </Text>
                {moment(selectedOrder.order_date).format("MMM D, YYYY h:mm A")}
              </Col>
              <Col span={12}>
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
            />

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Total Cost"
                  value={selectedOrder.total_cost}
                  precision={2}
                  prefix="Rs: "
                />
              </Col>
              <Col span={12}>
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
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Product Profit"
                      value={selectedOrder.income.profit_from_products}
                      precision={2}
                      prefix="Rs: "
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Delivery Fee"
                      value={selectedOrder.income.delivery_fee}
                      precision={2}
                      prefix="Rs: "
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Service Charge"
                      value={selectedOrder.income.service_charge}
                      precision={2}
                      prefix="Rs: "
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