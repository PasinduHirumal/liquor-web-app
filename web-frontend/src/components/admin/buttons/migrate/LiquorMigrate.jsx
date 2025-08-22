import React, { useState } from "react";
import { Button, Alert } from "antd";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";

function LiquorMigrate() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleMigrate = async () => {
        setLoading(true);
        setSuccess(null);
        setError(null);

        try {
            const response = await axiosInstance.post("/products/migrate");
            if (response.data.success) {
                toast.success("Search tokens migrated successfully!");
                setSuccess(response.data.message || "Migration completed successfully.");
            } else {
                setError("Migration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred during migration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="text-xl font-semibold">Liquor Search Token Migration</h2>

            <Button
                type="primary"
                onClick={handleMigrate}
                loading={loading}
                disabled={loading}
            >
                {loading ? "Migrating..." : "Migrate Search Tokens"}
            </Button>

            {success && (
                <Alert
                    message={success}
                    type="success"
                    showIcon
                    className="mt-3"
                />
            )}

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="mt-3"
                />
            )}
        </div>
    );
}

export default LiquorMigrate;
