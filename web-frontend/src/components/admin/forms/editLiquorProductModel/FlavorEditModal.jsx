import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const FlavorEditModal = ({ show, handleClose, flavour }) => {
    if (!flavour) return null;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-lg" // Increased width
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
                                    defaultValue={flavour.primary_flavour}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Tasting Profile</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={flavour.tasting_profile}
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
                            defaultValue={flavour.flavour_notes?.join(", ")}
                            className="rounded-1"
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Fruit Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={flavour.fruit_flavours?.join(", ")}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Spice Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={flavour.spice_flavours?.join(", ")}
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
                                    defaultValue={flavour.herbal_flavours?.join(", ")}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Wood Flavours</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={flavour.wood_flavours?.join(", ")}
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
                                    defaultValue={flavour.sweetness_level}
                                    min="0"
                                    max="10"
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Bitterness Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    defaultValue={flavour.bitterness_level}
                                    min="0"
                                    max="10"
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Smokiness Level</Form.Label>
                                <Form.Control
                                    type="number"
                                    defaultValue={flavour.smokiness_level}
                                    min="0"
                                    max="10"
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
                                    defaultValue={flavour.finish_type}
                                    className="rounded-1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Finish Notes</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={flavour.finish_notes}
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
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    className="px-4 rounded-1"
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FlavorEditModal;