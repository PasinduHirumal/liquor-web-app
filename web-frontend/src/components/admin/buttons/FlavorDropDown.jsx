import React, { useState } from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import "./FlavorDropDown.css";

const FlavorDropDown = ({ flavour }) => {
    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    if (!flavour) return null;

    return (
        <div className="flavour-section">
            {/* Header Toggle */}
            <div className="flavour-header">
                <button className="flavour-toggle" onClick={() => setOpen(!open)}>
                    <h3 className="flavour-title">Flavor Profile</h3>
                    {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {open && (
                    <button
                        className="edit-btn"
                        onClick={() => setShowModal(true)}
                        title="Edit Flavor Profile"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            {/* Dropdown Content */}
            <div className={`flavour-content ${open ? "open" : ""}`}>
                <div className="flavour-grid">
                    <div><span className="label">Primary Flavour:</span> {flavour.primary_flavour || "N/A"}</div>
                    <div><span className="label">Flavour Notes:</span> {flavour.flavour_notes?.join(", ") || "N/A"}</div>
                    <div><span className="label">Fruit:</span> {flavour.fruit_flavours?.join(", ") || "N/A"}</div>
                    <div><span className="label">Spice:</span> {flavour.spice_flavours?.join(", ") || "N/A"}</div>
                    <div><span className="label">Herbal:</span> {flavour.herbal_flavours?.join(", ") || "N/A"}</div>
                    <div><span className="label">Wood:</span> {flavour.wood_flavours?.join(", ") || "N/A"}</div>
                    <div><span className="label">Sweetness Level:</span> {flavour.sweetness_level ?? "N/A"}</div>
                    <div><span className="label">Bitterness Level:</span> {flavour.bitterness_level ?? "N/A"}</div>
                    <div><span className="label">Smokiness Level:</span> {flavour.smokiness_level ?? "N/A"}</div>
                    <div><span className="label">Finish Type:</span> {flavour.finish_type || "N/A"}</div>
                    <div><span className="label">Finish Notes:</span> {flavour.finish_notes || "N/A"}</div>
                    <div><span className="label">Tasting Profile:</span> {flavour.tasting_profile || "N/A"}</div>
                </div>
            </div>

            {/* Modal using React Bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary">Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FlavorDropDown;
