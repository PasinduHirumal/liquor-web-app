import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

function AppInfo() {
    const [mainAppData, setMainAppData] = useState(null);
    const [allAppData, setAllAppData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("main");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [mainRes, allRes] = await Promise.all([
                    axiosInstance.get("/appInfo/getMainAppInfo"),
                    axiosInstance.get("/appInfo/getAll")
                ]);

                setMainAppData(mainRes.data.data || null);
                setAllAppData(allRes.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch app info");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-5">Loading app info...</div>;
    }

    if (error) {
        return <div className="p-5 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="pt-5 bg-white p-4">
            <h1 className="text-xl font-bold mb-4">App Info</h1>

            {/* Tab Navigation */}
            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === "main"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("main")}
                >
                    Main App Info
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === "all"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("all")}
                >
                    All App Data ({allAppData.length})
                </button>
            </div>

            {/* Main App Info Tab */}
            {activeTab === "main" && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Main Application Information</h2>
                    {!mainAppData ? (
                        <p>No main app info available</p>
                    ) : (
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-left">ID</th>
                                    <th className="border px-4 py-2 text-left">Reg Number</th>
                                    <th className="border px-4 py-2 text-left">Description</th>
                                    <th className="border px-4 py-2 text-left">App Version</th>
                                    <th className="border px-4 py-2 text-left">Liquor Show</th>
                                    <th className="border px-4 py-2 text-left">Created At</th>
                                    <th className="border px-4 py-2 text-left">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={mainAppData.id}>
                                    <td className="border px-4 py-2">{mainAppData.id}</td>
                                    <td className="border px-4 py-2">{mainAppData.reg_number}</td>
                                    <td className="border px-4 py-2">{mainAppData.description}</td>
                                    <td className="border px-4 py-2">{mainAppData.app_version}</td>
                                    <td className="border px-4 py-2">
                                        {mainAppData.is_liquor_show ? "Yes" : "No"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {mainAppData.createdAt ? new Date(mainAppData.createdAt).toLocaleString() : "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {mainAppData.updatedAt ? new Date(mainAppData.updatedAt).toLocaleString() : "N/A"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* All App Data Tab */}
            {activeTab === "all" && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">All Application Data</h2>
                    {allAppData.length === 0 ? (
                        <p>No app info available</p>
                    ) : (
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-left">ID</th>
                                    <th className="border px-4 py-2 text-left">Reg Number</th>
                                    <th className="border px-4 py-2 text-left">Description</th>
                                    <th className="border px-4 py-2 text-left">App Version</th>
                                    <th className="border px-4 py-2 text-left">Liquor Show</th>
                                    <th className="border px-4 py-2 text-left">Created At</th>
                                    <th className="border px-4 py-2 text-left">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allAppData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border px-4 py-2">{item.id}</td>
                                        <td className="border px-4 py-2">{item.reg_number}</td>
                                        <td className="border px-4 py-2">{item.description}</td>
                                        <td className="border px-4 py-2">{item.app_version}</td>
                                        <td className="border px-4 py-2">
                                            {item.is_liquor_show ? "Yes" : "No"}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default AppInfo;