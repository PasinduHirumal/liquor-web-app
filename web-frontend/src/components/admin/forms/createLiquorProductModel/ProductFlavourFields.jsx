import React from "react";
import { Form, Col, Row, InputGroup } from "react-bootstrap";

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
    const handleArrayInput = (fieldName, value, currentArray = []) => {
        // If backspace pressed on empty input, remove last item
        if (value === '' && currentArray.length > 0) {
            const newArray = [...currentArray];
            newArray.pop();
            setFieldValue(fieldName, newArray);
            return;
        }

        // If comma or enter pressed, add to array
        if (value.endsWith(',') || value.endsWith(' ')) {
            const itemToAdd = value.slice(0, -1).trim();
            if (itemToAdd) {
                setFieldValue(fieldName, [...currentArray, itemToAdd]);
                return ''; // Clear input after adding
            }
            return '';
        }

        return value; // Return current value if no action needed
    };

    const removeArrayItem = (fieldName, index, currentArray) => {
        const newArray = [...currentArray];
        newArray.splice(index, 1);
        setFieldValue(fieldName, newArray);
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
                            onChange={handleChange}
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
            </Row>

            {/* Flavour Notes */}
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Flavour Notes</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.flavour_notes_input"
                            value={values.flavour.flavour_notes_input || ""}
                            onChange={(e) => {
                                const newValue = handleArrayInput(
                                    "flavour.flavour_notes",
                                    e.target.value,
                                    values.flavour.flavour_notes || []
                                );
                                setFieldValue("flavour.flavour_notes_input", newValue);
                            }}
                            onBlur={handleBlur}
                            disabled={loading}
                            isInvalid={getFieldState("flavour.flavour_notes").isInvalid}
                            placeholder="Type a note and press comma or space to add"
                        />
                        <Form.Control.Feedback type="invalid">
                            {getFieldState("flavour.flavour_notes").errorMessage}
                        </Form.Control.Feedback>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {values.flavour.flavour_notes?.map((note, index) => (
                                <span key={index} className="badge bg-primary">
                                    {note}
                                    <button
                                        type="button"
                                        className="ms-2 btn-close btn-close-white"
                                        style={{ fontSize: '0.5rem' }}
                                        onClick={() => removeArrayItem(
                                            "flavour.flavour_notes",
                                            index,
                                            values.flavour.flavour_notes
                                        )}
                                        aria-label="Remove"
                                    />
                                </span>
                            ))}
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            {/* Flavour Categories */}
            {[
                { name: 'fruit_flavours', label: 'Fruit Flavours', placeholder: 'e.g. Apple, Cherry' },
                { name: 'spice_flavours', label: 'Spice Flavours', placeholder: 'e.g. Cinnamon, Pepper' },
                { name: 'herbal_flavours', label: 'Herbal Flavours', placeholder: 'e.g. Mint, Thyme' },
                { name: 'wood_flavours', label: 'Wood Flavours', placeholder: 'e.g. Oak, Cedar' }
            ].map((field) => (
                <Row key={field.name}>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type="text"
                                name={`flavour.${field.name}_input`}
                                value={values.flavour[`${field.name}_input`] || ""}
                                onChange={(e) => {
                                    const newValue = handleArrayInput(
                                        `flavour.${field.name}`,
                                        e.target.value,
                                        values.flavour[field.name] || []
                                    );
                                    setFieldValue(`flavour.${field.name}_input`, newValue);
                                }}
                                onBlur={handleBlur}
                                disabled={loading}
                                placeholder={field.placeholder}
                            />
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {values.flavour[field.name]?.map((item, index) => (
                                    <span key={index} className="badge bg-secondary">
                                        {item}
                                        <button
                                            type="button"
                                            className="ms-2 btn-close btn-close-white"
                                            style={{ fontSize: '0.5rem' }}
                                            onClick={() => removeArrayItem(
                                                `flavour.${field.name}`,
                                                index,
                                                values.flavour[field.name]
                                            )}
                                            aria-label="Remove"
                                        />
                                    </span>
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            ))}

            {/* Intensity Levels */}
            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sweetness Level (0-10)</Form.Label>
                        <Form.Range
                            name="flavour.sweetness_level"
                            min="0"
                            max="10"
                            value={values.flavour.sweetness_level || 0}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                        <div className="text-center">{values.flavour.sweetness_level || 0}</div>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Bitterness Level (0-10)</Form.Label>
                        <Form.Range
                            name="flavour.bitterness_level"
                            min="0"
                            max="10"
                            value={values.flavour.bitterness_level || 0}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                        <div className="text-center">{values.flavour.bitterness_level || 0}</div>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Smokiness Level (0-10)</Form.Label>
                        <Form.Range
                            name="flavour.smokiness_level"
                            min="0"
                            max="10"
                            value={values.flavour.smokiness_level || 0}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={loading}
                        />
                        <div className="text-center">{values.flavour.smokiness_level || 0}</div>
                    </Form.Group>
                </Col>
            </Row>

            {/* Finish Section */}
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
                        <Form.Label>Finish Notes</Form.Label>
                        <Form.Control
                            type="text"
                            name="flavour.finish_notes_input"
                            value={values.flavour.finish_notes_input || ""}
                            onChange={(e) => {
                                const newValue = handleArrayInput(
                                    "flavour.finish_notes",
                                    e.target.value,
                                    values.flavour.finish_notes || []
                                );
                                setFieldValue("flavour.finish_notes_input", newValue);
                            }}
                            onBlur={handleBlur}
                            disabled={loading}
                            placeholder="Type a note and press comma or space to add"
                        />
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {values.flavour.finish_notes?.map((note, index) => (
                                <span key={index} className="badge bg-info text-dark">
                                    {note}
                                    <button
                                        type="button"
                                        className="ms-2 btn-close"
                                        style={{ fontSize: '0.5rem' }}
                                        onClick={() => removeArrayItem(
                                            "flavour.finish_notes",
                                            index,
                                            values.flavour.finish_notes
                                        )}
                                        aria-label="Remove"
                                    />
                                </span>
                            ))}
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            {/* Tasting Profile */}
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