import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";

const FlavorEditModal = ({ show, handleClose, flavour, onUpdated }) => {
    const { id: productId } = useParams(); // get product ID from URL
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    // Sync form data when flavour prop changes
    useEffect(() => {
        if (flavour) {
            setFormData({
                primary_flavour: flavour.primary_flavour || "",
                tasting_profile: flavour.tasting_profile || "",
                flavour_notes: flavour.flavour_notes?.join(", ") || "",
                fruit_flavours: flavour.fruit_flavours?.join(", ") || "",
                spice_flavours: flavour.spice_flavours?.join(", ") || "",
                herbal_flavours: flavour.herbal_flavours?.join(", ") || "",
                wood_flavours: flavour.wood_flavours?.join(", ") || "",
                sweetness_level: flavour.sweetness_level ?? 0,
                bitterness_level: flavour.bitterness_level ?? 0,
                smokiness_level: flavour.smokiness_level ?? 0,
                finish_type: flavour.finish_type || "",
                finish_notes: flavour.finish_notes || "",
            });
        }
    }, [flavour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                flavour: {
                    ...formData,
                    flavour_notes: formData.flavour_notes
                        ? formData.flavour_notes.split(",").map((s) => s.trim())
                        : [],
                    fruit_flavours: formData.fruit_flavours
                        ? formData.fruit_flavours.split(",").map((s) => s.trim())
                        : [],
                    spice_flavours: formData.spice_flavours
                        ? formData.spice_flavours.split(",").map((s) => s.trim())
                        : [],
                    herbal_flavours: formData.herbal_flavours
                        ? formData.herbal_flavours.split(",").map((s) => s.trim())
                        : [],
                    wood_flavours: formData.wood_flavours
                        ? formData.wood_flavours.split(",").map((s) => s.trim())
                        : [],
                },
            };

            await axiosInstance.patch(`/products/update/${productId}`, payload);

            toast.success("Flavor profile updated successfully!");
            handleClose();
            if (onUpdated) onUpdated(); // parent refresh
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to update flavor profile."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!flavour) return null;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-lg"
            className="pt-5"
        >
            <Modal.Header closeButton className="border-bottom-0">
                <Modal.Title className="fw-bold">Edit Flavor Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Primary Flavour</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="primary_flavour"
                                    value={formData.primary_flavour || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Tasting Profile</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tasting_profile"
                                    value={formData.tasting_profile || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Flavour Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="flavour_notes"
                            value={formData.flavour_notes || ""}
                            onChange={handleChange}
                            className="rounded-1"
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Fruit Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fruit_flavours"
                                    value={formData.fruit_flavours || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Spice Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="spice_flavours"
                                    value={formData.spice_flavours || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Herbal Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="herbal_flavours"
                                    value={formData.herbal_flavours || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Wood Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="wood_flavours"
                                    value={formData.wood_flavours || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Sweetness Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sweetness_level"
                                    value={formData.sweetness_level}
                                    min="0"
                                    max="10"
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Bitterness Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="bitterness_level"
                                    value={formData.bitterness_level}
                                    min="0"
                                    max="10"
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Smokiness Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="smokiness_level"
                                    value={formData.smokiness_level}
                                    min="0"
                                    max="10"
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Finish Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="finish_type"
                                    value={formData.finish_type || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Finish Notes</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="finish_notes"
                                    value={formData.finish_notes || ""}
                                    onChange={handleChange}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-top-0">
                <Button
                    variant="outline-secondary"
                    onClick={handleClose}
                    className="px-4 rounded-1"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    className="px-4 rounded-1"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FlavorEditModal;
