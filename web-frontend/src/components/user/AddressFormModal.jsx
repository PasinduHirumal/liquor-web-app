import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const AddressFormModal = ({
    show,
    handleClose,
    handleSubmit,
    handleInputChange,
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
                            </Form.Group>
                        </Col>

                        {/* PHONE */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ""}
                                    onChange={handleInputChange}
                                    placeholder="+947XXXXXXXX"
                                />
                            </Form.Group>
                        </Col>

                        {/* STREET ADDRESS (REQUIRED) */}
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label>Street Address</Form.Label>
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

                        {/* CITY */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* STATE */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>State / Province</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* POSTAL */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {/* COUNTRY */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
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

                        {/* ACTIVE */}
                        <Col xs={12}>
                            <Form.Check
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
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