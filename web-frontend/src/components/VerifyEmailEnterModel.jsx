import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VerifyEmailEnterModel = ({ show, onHide }) => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        localStorage.setItem("otpEmail", email);
        navigate("/verify-otp", { state: { email } });
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Email Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-3">
                    Enter the email you want to verify:
                </p>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">
                        Send Verification Email
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default VerifyEmailEnterModel;
