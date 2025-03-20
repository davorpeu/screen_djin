// src/features/lists/components/ListDetail.tsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchListDetails } from '../../../store/slices/listSlice';
import { Layout, Card, Typography, Button, Row, Col, Empty, Spin, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { MovieCard } from '../../moviesList/components/MovieCard';

const { Content } = Layout;
const { Title, Text } = Typography;

export const ListDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { data: list, loading, error } = useAppSelector(state => state.lists.currentList);

    useEffect(() => {
        if (id) {
            dispatch(fetchListDetails(parseInt(id)));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} tip="Loading list..." />
            </div>
        );
    }

    if (error) {
        return (
            <Empty
                description={<>
                    <Text type="danger">{error}</Text>
                    <div style={{ marginTop: '8px' }}>Failed to load list</div>
                </>}
            />
        );
    }

    if (!list) {
        return <Empty description="List not found" />;
    }

    return (
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: '16px' }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/" onClick={(e) => {
                        e.preventDefault();
                        // Navigate to home and set active tab to lists
                        window.location.href = '/#lists';
                    }}>My Lists</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{list.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                style={{ marginBottom: '24px' }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ marginRight: '16px' }}>
                            <Button icon={<ArrowLeftOutlined />}>Back</Button>
                        </Link>
                        <Title level={3} style={{ margin: 0 }}>{list.name}</Title>
                    </div>
                }
            >
                <div>
                    {list.description && (
                        <Text style={{ display: 'block', marginBottom: '16px' }}>
                            {list.description}
                        </Text>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <Text type="secondary">Created by: {list.created_by}</Text>
                        <Text type="secondary">{list.items.length} movies</Text>
                    </div>

                    {list.items.length === 0 ? (
                        <Empty description="This list is empty" />
                    ) : (
                        <Row gutter={[24, 24]}>
                            {list.items.map(movie => (
                                <Col xs={24} sm={12} md={8} key={movie.id}>
                                    <MovieCard movie={movie} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Card>
        </Content>
    );
};