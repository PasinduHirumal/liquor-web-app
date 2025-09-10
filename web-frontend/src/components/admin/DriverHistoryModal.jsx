import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Spin } from "antd";
import { axiosInstance } from "../../lib/axios";

const DriverHistoryModal = ({ visible, onClose, driver }) => {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!driver?.id) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get(`/payment/history/driver/${driver.id}`);
        if (res.data.success) {
          setPayments(res.data.data);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchPaymentHistory();
    }
  }, [visible, driver]);

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
    },
    {
      title: "Before Balance",
      dataIndex: "current_balance_before",
      key: "current_balance_before",
      render: (val) => `Rs ${val.toFixed(2)}`,
    },
    {
      title: "Payment Value",
      dataIndex: "payment_value",
      key: "payment_value",
      render: (val) => `Rs ${val.toFixed(2)}`,
    },
    {
      title: "New Balance",
      dataIndex: "current_balance_new",
      key: "current_balance_new",
      render: (val) => `Rs ${val.toFixed(2)}`,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (val) => new Date(val).toLocaleString(),
    },
  ];

  return (
    <Modal
      title="Driver Payment History"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {driver ? (
        <div>
          <p>
            <strong>Name:</strong> {driver.firstName} {driver.lastName}
          </p>
          <p>
            <strong>Email:</strong> {driver.email}
          </p>
          <p>
            <strong>Total Earnings:</strong> Rs {driver.totalEarnings || 0}
          </p>
          <p>
            <strong>Total Withdraws:</strong> Rs {driver.totalWithdraws || 0}
          </p>
          <p>
            <strong>Current Balance:</strong> Rs {driver.currentBalance || 0}
          </p>

          <h3 style={{ marginTop: 20 }}>Payment History</h3>

          {loading ? (
            <Spin tip="Loading payment history..." />
          ) : payments.length > 0 ? (
            <Table
              columns={columns}
              dataSource={payments.map((p) => ({ ...p, key: p.payment_id }))}
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <p style={{ marginTop: 16, fontStyle: "italic", color: "#888" }}>
              No payment history found.
            </p>
          )}
        </div>
      ) : (
        <p>No driver selected.</p>
      )}
    </Modal>
  );
};

export default DriverHistoryModal;
