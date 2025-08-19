import React from "react";
import { Form, Col, Row } from "react-bootstrap";

const flavourOptions = [
    "Sweet", "Dry", "Bitter", "Smoky", "Fruity", "Spicy",
    "Herbal", "Woody", "Floral", "Earthy", "Citrusy",
    "Nutty", "Creamy"
];

const finishTypeOptions = ["Short", "Medium", "Long"];

const tastingProfileOptions = [
    "Light", "Medium", "Full-bodied",
    "Complex", "Smooth", "Bold"
];

const ProductFlavourFields = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    loading
}) => {
    // Handle comma-separated inputs
    const handleArrayFieldChange = (fieldName, e) => {
        const value = e.target.value;
        const arrayValue = value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        setFieldValue(fieldName, arrayValue);
    };

    // Error/touched state helper
    const getFieldState = (fieldPath) => {
        const fieldTouched = touched.flavour?.[fieldPath.split(".")[1]];
        const fieldError = errors.flavour?.[fieldPath.split(".")[1]];
        return {
            isInvalid: fieldTouched && fieldError,
            errorMessage: fieldError,
        };
    };

    return (
        <>
            <h5 className="mt-3">Flavour Profile</h5>

            {/* Primary flavour + notes */}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Primary Flavour</Form.Label>
                        <Form.Select
                            name="flavour.primary_flavour"
                            value={values.flavour.primary_flavour || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.primary_flavour").isInvalid}
                        >
                            <option value="">Select a flavour</option>
                            {flavourOptions.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.primary_flavour").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Flavour Notes (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.flavour_notes"
                            value={Array.isArray(values.flavour.flavour_notes)
                                ? values.flavour.flavour_notes.join(", ")
                                : ""}
                            onChange={(e) =>
                                handleArrayFieldChange("flavour.flavour_notes", e)
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.flavour_notes").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.flavour_notes").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            {/* Other array categories */}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fruit Flavours (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.fruit_flavours"
                            value={Array.isArray(values.flavour.fruit_flavours)
                                ? values.flavour.fruit_flavours.join(", ")
                                : ""}
                            onChange={(e) =>
                                handleArrayFieldChange("flavour.fruit_flavours", e)
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.fruit_flavours").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.fruit_flavours").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Spice Flavours (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.spice_flavours"
                            value={Array.isArray(values.flavour.spice_flavours)
                                ? values.flavour.spice_flavours.join(", ")
                                : ""}
                            onChange={(e) =>
                                handleArrayFieldChange("flavour.spice_flavours", e)
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.spice_flavours").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.spice_flavours").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Herbal Flavours (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.herbal_flavours"
                            value={Array.isArray(values.flavour.herbal_flavours)
                                ? values.flavour.herbal_flavours.join(", ")
                                : ""}
                            onChange={(e) =>
                                handleArrayFieldChange("flavour.herbal_flavours", e)
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.herbal_flavours").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.herbal_flavours").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Wood Flavours (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.wood_flavours"
                            value={Array.isArray(values.flavour.wood_flavours)
                                ? values.flavour.wood_flavours.join(", ")
                                : ""}
                            onChange={(e) =>
                                handleArrayFieldChange("flavour.wood_flavours", e)
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.wood_flavours").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.wood_flavours").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            {/* Intensity levels */}
            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sweetness Level (0–10)</Form.Label>
                        <Form.Control
                            type="number"
                            name="flavour.sweetness_level"
                            min="0"
                            max="10"
                            value={values.flavour.sweetness_level ?? 0}
                            onChange={(e) =>
                                setFieldValue("flavour.sweetness_level", Number(e.target.value))
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.sweetness_level").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.sweetness_level").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Bitterness Level (0–10)</Form.Label>
                        <Form.Control
                            type="number"
                            name="flavour.bitterness_level"
                            min="0"
                            max="10"
                            value={values.flavour.bitterness_level ?? 0}
                            onChange={(e) =>
                                setFieldValue("flavour.bitterness_level", Number(e.target.value))
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.bitterness_level").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.bitterness_level").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Smokiness Level (0–10)</Form.Label>
                        <Form.Control
                            type="number"
                            name="flavour.smokiness_level"
                            min="0"
                            max="10"
                            value={values.flavour.smokiness_level ?? 0}
                            onChange={(e) =>
                                setFieldValue("flavour.smokiness_level", Number(e.target.value))
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.smokiness_level").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.smokiness_level").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            {/* Finish */}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Finish Type</Form.Label>
                        <Form.Select
                            name="flavour.finish_type"
                            value={values.flavour.finish_type || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.finish_type").isInvalid}
                        >
                            <option value="">Select finish type</option>
                            {finishTypeOptions.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.finish_type").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Finish Notes (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.finish_notes"
                            value={Array.isArray(values.flavour.finish_notes)
                                ? values.flavour.finish_notes.join(", ")
                                : ""}
                            onChange={(e) =>
                                handleArrayFieldChange("flavour.finish_notes", e)
                            }
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.finish_notes").isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.finish_notes").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            {/* Overall tasting profile */}
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tasting Profile</Form.Label>
                        <Form.Select
                            name="flavour.tasting_profile"
                            value={values.flavour.tasting_profile || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.tasting_profile").isInvalid}
                        >
                            <option value="">Select tasting profile</option>
                            {tastingProfileOptions.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.tasting_profile").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};

export default ProductFlavourFields;
