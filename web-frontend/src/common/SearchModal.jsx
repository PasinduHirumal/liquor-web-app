import React from "react";
import { Modal, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchModal = ({ open, onClose }) => {
  return (
    <Modal
      title="Search"
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      style={{
        top: 70,
      }}
      width="95%"
      bodyStyle={{
        padding: "16px",
      }}
    >
      <Input.Search
        placeholder="Search for products..."
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={(value) => console.log("Searching:", value)}
      />
    </Modal>
  );
};

export default SearchModal;
