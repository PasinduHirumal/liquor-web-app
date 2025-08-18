import React from "react";
import { Form, Col, Row } from "react-bootstrap";

const ProductFlavourFields = ({ values, errors, touched, handleChange, handleBlur, setFieldValue, loading }) => (
    <>
        <h5 className="mt-3">Flavour Profile</h5>
        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Primary Flavour</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour_profile.primary_flavour"
                        value={values.flavour_profile.primary_flavour}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour_profile.notes"
                        value={values.flavour_profile.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Sweetness (0–10)</Form.Label>
                    <Form.Control
                        type="number"
                        name="flavour_profile.sweetness"
                        min="0"
                        max="10"
                        value={values.flavour_profile.sweetness}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Bitterness (0–10)</Form.Label>
                    <Form.Control
                        type="number"
                        name="flavour_profile.bitterness"
                        min="0"
                        max="10"
                        value={values.flavour_profile.bitterness}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label>Smokiness (0–10)</Form.Label>
                    <Form.Control
                        type="number"
                        name="flavour_profile.smokiness"
                        min="0"
                        max="10"
                        value={values.flavour_profile.smokiness}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                    />
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={12}>
                <Form.Group className="mb-3">
                    <Form.Label>Finish</Form.Label>
                    <Form.Control
                        type="text"
                        name="flavour_profile.finish"
                        value={values.flavour_profile.finish}
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
