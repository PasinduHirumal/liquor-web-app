import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import {
    Container,
    Table,
    Spinner,
    Alert,
    Button,
    Form,
    Row,
    Col,
    Badge
} from 'react-bootstrap';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const query = filter !== 'all' ? `?is_active=${filter === 'active'}` : '';
            const response = await axiosInstance.get(`/categories/getAll${query}`);
            setCategories(response.data.data);
        } catch (err) {
            console.error('Fetch error:', err.message);
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [filter]);

    const getBadge = (bool) => (
        <Badge bg={bool ? 'success' : 'secondary'}>{bool ? 'Active' : 'Inactive'}</Badge>
    );

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col><h2>Manage Categories</h2></Col>
                <Col xs="auto">
                    <Form.Select value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Liquor</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No categories found.</td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr key={category.category_id}>
                                        <td>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        <td>{category.is_liquor ? 'Yes' : 'No'}</td>
                                        <td>{getBadge(category.is_active)}</td>
                                        <td>{new Date(category.created_at).toLocaleString()}</td>
                                        <td>{new Date(category.updated_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    );
};

export default ManageCategory;
