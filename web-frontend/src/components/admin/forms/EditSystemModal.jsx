import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const EditSystemModal = ({ show, onHide, companyDetailId, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        where_house_name: "",
        where_house_location: {
            lat: "",
            lng: "",
        },
        delivery_charge_for_1KM: "",
        service_charge: "",
        isActive: false,
    });

    const [modalLoading, setModalLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // Fetch company details by ID when modal opens or companyDetailId changes
    useEffect(() => {
        if (!show || !companyDetailId) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const res = await axiosInstance.get("/system/details");
                // Your backend returns array, so find by ID
                const company = res.data.data;

                // If you want to support multiple records:
                // const company = res.data.data.find(item => item.id === companyDetailId);

                if (!company) {
                    toast.error("Company details not found");
                    onHide();
                    return;
                }

                setFormData({
                    where_house_name: company.where_house_name || "",
                    where_house_location: company.where_house_location || { lat: "", lng: "" },
                    delivery_charge_for_1KM: company.delivery_charge_for_1KM ?? "",
                    service_charge: company.service_charge ?? "",
                    isActive: company.isActive ?? false,
                });
            } catch (err) {
                toast.error("Failed to load company details");
                onHide();
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [show, companyDetailId, onHide]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "lat" || name === "lng") {
            setFormData((prev) => ({
                ...prev,
                where_house_location: {
                    ...prev.where_house_location,
                    [name]: value,
                },
            }));
        } else if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateFormData = () => {
        const { where_house_name, where_house_location, delivery_charge_for_1KM, service_charge } = formData;

        if (!where_house_name || !/^where_house_\d+$/.test(where_house_name)) {
            toast.error("Warehouse name must be in the format 'where_house_#'");
            return false;
        }

        if (where_house_location) {
            const lat = parseFloat(where_house_location.lat);
            const lng = parseFloat(where_house_location.lng);

            if (isNaN(lat) || lat < -90 || lat > 90) {
                toast.error("Warehouse latitude must be between -90 and 90");
                return false;
            }

            if (isNaN(lng) || lng < -180 || lng > 180) {
                toast.error("Warehouse longitude must be between -180 and 180");
                return false;
            }
        }

        if (delivery_charge_for_1KM === "" || Number(delivery_charge_for_1KM) < 0) {
            toast.error("Delivery charge per 1KM must be a non-negative number");
            return false;
        }

        if (service_charge === "" || Number(service_charge) < 0) {
            toast.error("Service charge must be a non-negative number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFormData()) return;

        setModalLoading(true);

        // Prepare payload with correct types
        const payload = {
            where_house_name: formData.where_house_name,
            where_house_location: {
                lat: Number(formData.where_house_location.lat),
                lng: Number(formData.where_house_location.lng),
            },
            delivery_charge_for_1KM: Number(formData.delivery_charge_for_1KM),
            service_charge: Number(formData.service_charge),
            isActive: formData.isActive,
        };

        try {
            await axiosInstance.patch(`/system/update/${companyDetailId}`, payload);

            // Refetch updated data
            const res = await axiosInstance.get("/system/details");
            onUpdateSuccess(res.data.data);

            toast.success("System details updated successfully");
            onHide();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update system details");
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <Modal
            className="py-5"
            show={show}
            onHide={() => !modalLoading && !loadingData && onHide()}
            backdrop="static"
            keyboard={!modalLoading && !loadingData}
        >
            <Modal.Header closeButton={!modalLoading && !loadingData}>
                <Modal.Title>Edit System Details</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {loadingData ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" role="status" />
                        </div>
                    ) : (
                        <>
                            <Form.Group className="mb-3" controlId="where_house_name">
                                <Form.Label>Warehouse Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="where_house_name"
                                    value={formData.where_house_name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. where_house_1"
                                    disabled={modalLoading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lat">
                                <Form.Label>Warehouse Latitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="lat"
                                    value={formData.where_house_location.lat}
                                    onChange={handleInputChange}
                                    step="any"
                                    disabled={modalLoading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lng">
                                <Form.Label>Warehouse Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="lng"
                                    value={formData.where_house_location.lng}
                                    onChange={handleInputChange}
                                    step="any"
                                    disabled={modalLoading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="delivery_charge_for_1KM">
                                <Form.Label>Delivery Charge per 1KM</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="delivery_charge_for_1KM"
                                    value={formData.delivery_charge_for_1KM}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    disabled={modalLoading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="service_charge">
                                <Form.Label>Service Charge</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="service_charge"
                                    value={formData.service_charge}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    disabled={modalLoading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="isActive">
                                <Form.Check
                                    type="checkbox"
                                    label="Active"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    disabled={modalLoading}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={modalLoading || loadingData}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={modalLoading || loadingData}>
                        {modalLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditSystemModal;
