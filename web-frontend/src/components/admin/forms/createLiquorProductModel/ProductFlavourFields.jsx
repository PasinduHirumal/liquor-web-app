import React from "react";
import { Form, Col, Row } from "react-bootstrap";

const ProductFlavourFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, loading }) => (
    <>
        <h5 className="mt-3">Flavour Profile</h5>

        {/* Primary flavour and notes */}
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Primary Flavour</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.primary_flavour"
                        value={values.flavour.primary_flavour}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Flavour Notes (comma separated)</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.flavour_notes"
                        value={values.flavour.flavour_notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>

        {/* Specific flavour categories */}
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Fruit Flavours (comma separated)</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.fruit_flavours"
                        value={values.flavour.fruit_flavours}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Spice Flavours (comma separated)</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.spice_flavours"
                        value={values.flavour.spice_flavours}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
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
                        value={values.flavour.herbal_flavours}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Wood Flavours (comma separated)</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.wood_flavours"
                        value={values.flavour.wood_flavours}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>

        {/* Intensity levels */}
        <Row>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Sweetness Level (0-10)</Form.Label>
                    <Form.Control
                        type="number"
                        name="flavour.sweetness_level"
                        min="0"
                        max="10"
                        value={values.flavour.sweetness_level}
                        onChange={handleChange}
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
                        value={values.flavour.bitterness_level}
                        onChange={handleChange}
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
                        value={values.flavour.smokiness_level}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>

        {/* Finish */}
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Finish Type</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.finish_type"
                        value={values.flavour.finish_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Finish Notes (comma separated)</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.finish_notes"
                        value={values.flavour.finish_notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>

        {/* Overall tasting profile */}
        <Row>
            <Col md={12}>
                <Form.Group className="mb-3">
                    <Form.Label>Tasting Profile</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour.tasting_profile"
                        value={values.flavour.tasting_profile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>
    </>
);

export default ProductFlavourFields;
