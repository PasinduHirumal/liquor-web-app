import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FlavorEditModal = ({ show, handleClose, flavour }) => {
    if (!flavour) return null;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            backdrop="static"
            keyboard={false}
            className="pt-5"
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Flavor Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Primary Flavour</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.primary_flavour} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Flavour Notes</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.flavour_notes?.join(", ")} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Fruit Flavours</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.fruit_flavours?.join(", ")} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Spice Flavours</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.spice_flavours?.join(", ")} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Herbal Flavours</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.herbal_flavours?.join(", ")} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Wood Flavours</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.wood_flavours?.join(", ")} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sweetness Level</Form.Label>
                        <Form.Control type="number" defaultValue={flavour.sweetness_level} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Bitterness Level</Form.Label>
                        <Form.Control type="number" defaultValue={flavour.bitterness_level} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Smokiness Level</Form.Label>
                        <Form.Control type="number" defaultValue={flavour.smokiness_level} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Finish Type</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.finish_type} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Finish Notes</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.finish_notes} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tasting Profile</Form.Label>
                        <Form.Control type="text" defaultValue={flavour.tasting_profile} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary">Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FlavorEditModal;
