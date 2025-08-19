import React, { useState } from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import FlavorEditModal from "../forms/editLiquorProductModel/FlavorEditModal";
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

            {/* Modal Component */}
            <FlavorEditModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                flavour={flavour}
            />
        </div>
    );
};

export default FlavorDropDown;
