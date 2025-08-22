import React, { useState } from "react";
import { Button } from "antd";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";

function LiquorMigrate() {
    const [loading, setLoading] = useState(false);

    const handleMigrate = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/products/migrate");
            if (response.data.success) {
                toast.success(response.data.message || "Liquors migrated successfully!");
            } else {
                toast.error("Migration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "An error occurred during migration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="primary"
            onClick={handleMigrate}
            loading={loading}
            className="rounded-md"
        >
            {loading ? "Migrating..." : "Migrate Liquors"}
        </Button>
    );
}

export default LiquorMigrate;
