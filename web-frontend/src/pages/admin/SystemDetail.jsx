import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Button,
} from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import toast from "react-hot-toast";
import EditSystemModal from "../../components/admin/forms/EditSystemModal";

const SystemDetail = () => {
    const [companyDetail, setCompanyDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get("/system/details");
                setCompanyDetail(res.data.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch system details");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetail();
    }, []);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <h2 className="text-center mb-4">System Details</h2>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <Card className="shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span>System Information</span>
                                    <Button
                                        variant="link"
                                        onClick={() => setShowModal(true)}
                                        aria-label="Edit"
                                    >
                                        <PencilSquare size={20} />
                                    </Button>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <strong>Warehouse Location:</strong>
                                        <br />
                                        Latitude: {companyDetail?.where_house_location?.lat ?? "N/A"}
                                        <br />
                                        Longitude: {companyDetail?.where_house_location?.lng ?? "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Delivery Charge per 1KM:</strong>{" "}
                                        {companyDetail?.delivery_charge_for_1KM ?? "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Service Charge:</strong>{" "}
                                        {companyDetail?.service_charge ?? "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Created At:</strong>{" "}
                                        {companyDetail?.created_at
                                            ? new Date(companyDetail.created_at).toLocaleString()
                                            : "N/A"}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Updated At:</strong>{" "}
                                        {companyDetail?.updated_at
                                            ? new Date(companyDetail.updated_at).toLocaleString()
                                            : "N/A"}
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                            <EditSystemModal
                                show={showModal}
                                onHide={() => setShowModal(false)}
                                companyDetail={companyDetail}
                                onUpdateSuccess={(updatedData) => setCompanyDetail(updatedData)}
                            />
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default SystemDetail;
