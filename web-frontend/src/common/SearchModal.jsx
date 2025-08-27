import React, { useState } from "react";
import { Modal, Input, Button, Spin, Row, Col, Empty } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "./LiquorProductCard";
import OtherProductCard from "./OtherProductCard";

const SearchModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setError("Please enter a search term.");
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get(`/search/all`, {
        params: {
          q: value,
          multiWord: true,
          limit: 20,
          offset: 0
        }
      });

      if (data.success) {
        setSearchResults(data.data || []);
      } else {
        setError(data.message || "Failed to fetch results.");
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong while searching.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<span style={{ color: "#fff", fontWeight: "bold" }}>Search Products</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={false}
      style={{
        top: 70,
      }}
      width="95%"
      bodyStyle={{
        paddingTop: "16px",
        backgroundColor: "#010524ff",
        maxHeight: "80vh",
        overflowY: "auto"
      }}
      styles={{
        header: {
          backgroundColor: "#010524ff",
          color: "#fff",
        },
        content: {
          backgroundColor: "#010524ff",
        },
      }}
    >
      {/* Custom Close Button */}
      <Button
        type="text"
        icon={<CloseOutlined style={{ color: "#fff", fontSize: "16px" }} />}
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
      />

      {/* Search Input */}
      <Input.Search
        placeholder="Search for products..."
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        style={{
          backgroundColor: "#010524ff",
          color: "#fff",
          marginBottom: "16px",
        }}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center" style={{ padding: "20px" }}>
          <Spin size="large" />
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>
      )}

      {/* Search Results */}
      {!loading && !error && searchResults.length > 0 && (
        <Row>
          {searchResults.map((product) => (
            <Col key={product.product_id || product.id}>
              {product.is_liquor ? (
                <LiquorProductCard product={product} userOnly />
              ) : (
                <OtherProductCard product={product} userOnly />
              )}
            </Col>
          ))}
        </Row>
      )}

      {/* Empty State */}
      {!loading && !error && searchResults.length === 0 && (
        <Empty description={<span style={{ color: "#fff" }}>No products found</span>} />
      )}
    </Modal>
  );
};

export default SearchModal;
