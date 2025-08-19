import React from "react";
import { Form, Col, Row } from "react-bootstrap";

const primaryFlavours = [
    'Sweet', 'Dry', 'Bitter', 'Smoky', 'Fruity', 'Spicy', 'Herbal',
    'Woody', 'Floral', 'Earthy', 'Citrusy', 'Nutty', 'Creamy'
];
const finishTypes = ['Short', 'Medium', 'Long'];
const tastingProfiles = ['Light', 'Medium', 'Full-bodied', 'Complex', 'Smooth', 'Bold'];

const ProductFlavourFields = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    loading
}) => {
    const handleArrayFieldChange = (fieldName, e) => {
        const value = e.target.value;
        if (!value.trim()) {
            setFieldValue(fieldName, []);
            return;
        }

        const arrayValue = value
            .split(",")
            .map(item => item.trim())
            .filter(item => item);
        setFieldValue(fieldName, arrayValue);
    };

    const handleSelectChange = (fieldName, e) => {
        setFieldValue(fieldName, e.target.value || null);
    };

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

            {/* Primary Flavour (Required) */}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Primary Flavour*</Form.Label>
                        <Form.Select
                            name="flavour.primary_flavour"
                            value={values.flavour.primary_flavour || ""}
                            onChange={(e) => handleSelectChange("flavour.primary_flavour", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.primary_flavour").isInvalid}
                            required
                        >
                            <option value="">Select a primary flavour</option>
                            {primaryFlavours.map(f => (
                                <option key={f} value={f}>{f}</option>
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
                            value={values.flavour.flavour_notes?.join(", ") || ""}
                            onChange={(e) => handleArrayFieldChange("flavour.flavour_notes", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.flavour_notes").isInvalid}
                            placeholder="e.g. Vanilla, Caramel, Oak"
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.flavour_notes").errorMessage}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            {/* Flavour Categories (All Optional) */}
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
                            onChange={(e) => handleArrayFieldChange("flavour.fruit_flavours", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="e.g. Apple, Cherry, Citrus"
                        />
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
                            onChange={(e) => handleArrayFieldChange("flavour.spice_flavours", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="e.g. Cinnamon, Pepper, Nutmeg"
                        />
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
                            onChange={(e) => handleArrayFieldChange("flavour.herbal_flavours", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="e.g. Mint, Thyme, Eucalyptus"
                        />
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
                            onChange={(e) => handleArrayFieldChange("flavour.wood_flavours", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="e.g. Oak, Cedar, Pine"
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Intensity Levels (All have defaults) */}
            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sweetness Level (0-10)</Form.Label>
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
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Bitterness Level (0-10)</Form.Label>
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
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Smokiness Level (0-10)</Form.Label>
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
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Finish Section (Optional) */}
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Finish Type</Form.Label>
                        <Form.Select
                            name="flavour.finish_type"
                            value={values.flavour.finish_type || ""}
                            onChange={(e) => handleSelectChange("flavour.finish_type", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                        >
                            <option value="">Select finish type (optional)</option>
                            {finishTypes.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Finish Notes (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.finish_notes"
                            value={values.flavour.finish_notes?.join(", ") || ""}
                            onChange={(e) => handleArrayFieldChange("flavour.finish_notes", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="e.g. Smooth, Lingering, Spicy"
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Tasting Profile (Optional) */}
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tasting Profile</Form.Label>
                        <Form.Select
                            name="flavour.tasting_profile"
                            value={values.flavour.tasting_profile || ""}
                            onChange={(e) => handleSelectChange("flavour.tasting_profile", e)}
                            onBlur={handleBlur}
                            disabled={loading}
                        >
                            <option value="">Select tasting profile (optional)</option>
                            {tastingProfiles.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};

export default ProductFlavourFields;