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
      width: 120,
    },
    {
      title: "Before Balance",
      dataIndex: "current_balance_before",
      key: "current_balance_before",
      width: 150,
      render: (val) => `Rs ${val.toFixed(2)}`,
    },
    {
      title: "Payment Value",
      dataIndex: "payment_value",
      key: "payment_value",
      width: 150,
      render: (val) => `Rs ${val.toFixed(2)}`,
    },
    {
      title: "New Balance",
      dataIndex: "current_balance_new",
      key: "current_balance_new",
      width: 150,
      render: (val) => `Rs ${val.toFixed(2)}`,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 200,
      render: (val) => new Date(val).toLocaleString(),
    },
  ];

  return (
    <Modal
      title={<span className="text-xl font-bold">Driver Payment History</span>}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {driver ? (
        <div>
          {/* Driver details */}
          <div className="flex flex-wrap gap-6 mb-5">
            <div>
              <span className="font-semibold">Name:</span> {driver.firstName} {driver.lastName}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {driver.email}
            </div>
            <div>
              <span className="font-semibold">Total Earnings:</span> Rs {driver.totalEarnings || 0}
            </div>
            <div>
              <span className="font-semibold">Total Withdraws:</span> Rs {driver.totalWithdraws || 0}
            </div>
            <div>
              <span className="font-semibold">Current Balance:</span> Rs {driver.currentBalance || 0}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Payment History</h3>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin tip="Loading payment history..." />
            </div>
          ) : payments.length > 0 ? (
            <Table
              columns={columns}
              dataSource={payments.map((p) => ({ ...p, key: p.payment_id }))}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 800 }}
              className="overflow-x-auto"
            />
          ) : (
            <p className="mt-4 italic text-gray-500">No payment history found.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No driver selected.</p>
      )}
    </Modal>
  );
};

export default DriverHistoryModal;
