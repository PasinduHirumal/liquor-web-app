import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";

const AddressFormModal = ({
    show,
    handleClose,
    handleSubmit,
    handleInputChange,
    handleLatitudeChange,
    handleLongitudeChange,
    formData,
    editingId,
    submitLoading,
}) => {
    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingId ? "Edit Address" : "Add New Address"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-3">

                        {/* FULL NAME */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName || ""}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                                <Form.Text className="text-muted">
                                    Optional - Name of recipient
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        {/* PHONE */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ""}
                                    onChange={handleInputChange}
                                    placeholder="+947XXXXXXXX"
                                />
                                <Form.Text className="text-muted">
                                    International format starting with +
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        {/* STREET ADDRESS (REQUIRED) */}
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Street Address *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress || ""}
                                    onChange={handleInputChange}
                                    placeholder="No 123, Main Street"
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* BUILDING */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Building / Apartment</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="buildingName"
                                    value={formData.buildingName || ""}
                                    onChange={handleInputChange}
                                    placeholder="Apartment, Suite, etc."
                                />
                            </Form.Group>
                        </Col>

                        {/* LANDMARK */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Landmark</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark || ""}
                                    onChange={handleInputChange}
                                    placeholder="Near school, temple..."
                                />
                            </Form.Group>
                        </Col>

                        {/* CITY (REQUIRED) */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>City *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* STATE (REQUIRED) */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>State / Province *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* POSTAL CODE (REQUIRED) */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Postal Code *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    required
                                    pattern="[A-Za-z0-9\s\-]{3,10}"
                                    title="Postal code must be 3-10 characters long and can contain letters, numbers, spaces, and hyphens"
                                />
                            </Form.Group>
                        </Col>

                        {/* COUNTRY (REQUIRED) */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Country *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* LATITUDE & LONGITUDE */}
                        <Col xs={12}>
                            <hr className="my-2" />
                            <div className="d-flex align-items-center mb-2">
                                <FaMapMarkerAlt className="text-primary me-2" />
                                <h6 className="mb-0">Geolocation (Optional)</h6>
                            </div>
                            <Form.Text className="text-muted mb-2 d-block">
                                Add precise location coordinates for better delivery accuracy
                            </Form.Text>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude !== null && formData.latitude !== "" ? formData.latitude : ""}
                                    onChange={handleLatitudeChange}
                                    placeholder="-90 to 90"
                                />
                                <Form.Text className="text-muted">
                                    Range: -90 to 90 (e.g., 40.7128)
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude !== null && formData.longitude !== "" ? formData.longitude : ""}
                                    onChange={handleLongitudeChange}
                                    placeholder="-180 to 180"
                                />
                                <Form.Text className="text-muted">
                                    Range: -180 to 180 (e.g., -74.0060)
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        {/* NOTES */}
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Delivery Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="notes"
                                    value={formData.notes || ""}
                                    onChange={handleInputChange}
                                    placeholder="Leave at gate, call before delivery..."
                                />
                            </Form.Group>
                        </Col>

                        {/* IS DEFAULT */}
                        <Col xs={12}>
                            <Form.Check
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault || false}
                                onChange={handleInputChange}
                                label="Set as default shipping address"
                            />
                        </Col>

                        {/* IS ACTIVE */}
                        <Col xs={12}>
                            <Form.Check
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive !== undefined ? formData.isActive : true}
                                onChange={handleInputChange}
                                label="Set as active shipping address"
                            />
                        </Col>

                        {/* SUBMIT */}
                        <Col xs={12}>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-3"
                                disabled={submitLoading}
                            >
                                {submitLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        {editingId ? "Updating..." : "Saving..."}
                                    </>
                                ) : (
                                    editingId ? "Update Address" : "Save Address"
                                )}
                            </Button>
                        </Col>

                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddressFormModal;