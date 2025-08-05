import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const EditSystemModal = ({ show, onHide, companyDetail, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        where_house_location: {
            lat: companyDetail?.where_house_location?.lat ?? "",
            lng: companyDetail?.where_house_location?.lng ?? "",
        },
        delivery_charge_for_1KM: companyDetail?.delivery_charge_for_1KM ?? "",
        service_charge: companyDetail?.service_charge ?? "",
    });

    const [modalLoading, setModalLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "lat" || name === "lng") {
            setFormData((prev) => ({
                ...prev,
                where_house_location: {
                    ...prev.where_house_location,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateFormData = () => {
        const lat = parseFloat(formData.where_house_location.lat);
        const lng = parseFloat(formData.where_house_location.lng);

        if (isNaN(lat) || lat < -90 || lat > 90) {
            toast.error("Warehouse latitude must be between -90 and 90");
            return false;
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            toast.error("Warehouse longitude must be between -180 and 180");
            return false;
        }

        if (formData.delivery_charge_for_1KM === "" || Number(formData.delivery_charge_for_1KM) < 0) {
            toast.error("Delivery charge per 1KM must be a non-negative number");
            return false;
        }

        if (formData.service_charge === "" || Number(formData.service_charge) < 0) {
            toast.error("Service charge must be a non-negative number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFormData()) return;

        setModalLoading(true);
        try {
            await axiosInstance.patch(`/system/update/${companyDetail.id}`, formData);
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
        <Modal className="mt-5 pt-2" show={show} onHide={() => !modalLoading && onHide()} backdrop="static" keyboard={!modalLoading}>
            <Modal.Header closeButton={!modalLoading}>
                <Modal.Title>Edit System Details</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-3">
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={modalLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={modalLoading}>
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
