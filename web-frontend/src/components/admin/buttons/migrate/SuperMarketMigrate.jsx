import React, { useState } from "react";
import { Button, Spin } from "antd";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";

function SuperMarketMigrate() {
    const [loading, setLoading] = useState(false);

    const handleMigrate = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/superMarket/migrate");
            if (response.data.success) {
                toast.success(response.data.message || "Supermarkets migrated successfully!");
            } else {
                toast.error(response.data.message || "Migration failed");
            }
        } catch (error) {
            console.error("Migration error:", error);
            toast.error(error.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="primary"
            onClick={handleMigrate}
            disabled={loading}
            className="rounded-md"
        >
            {loading ? <Spin size="small" /> : "Migrate Supermarkets"}
        </Button>
    );
}

export default SuperMarketMigrate;
