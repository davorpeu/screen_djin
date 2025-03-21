import React, {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Breadcrumb, Button, Card, Col, Empty, Layout, Row, Spin, Typography} from 'antd';
import {ArrowLeftOutlined, LoadingOutlined} from '@ant-design/icons';
import {useLists} from '@/features/lists';
import {MovieCard} from '@/features/movies';

const { Content } = Layout;
const { Title, Text } = Typography;

export const ListDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { currentList, getListDetails } = useLists();

    useEffect(() => {
        if (id) {
            getListDetails(parseInt(id));
        }
    }, [id, getListDetails]);

    if (currentList.loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} tip="Loading list..." />
            </div>
        );
    }

    if (currentList.error) {
        return (
            <Empty
                description={<>
                    <Text type="danger">{currentList.error}</Text>
                    <div style={{ marginTop: '8px' }}>Failed to load list</div>
                </>}
            />
        );
    }

    if (!currentList.data) {
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
                        window.location.href = '/#lists';
                    }}>My Lists</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{currentList.data.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                style={{ marginBottom: '24px' }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ marginRight: '16px' }}>
                            <Button icon={<ArrowLeftOutlined />}>Back</Button>
                        </Link>
                        <Title level={3} style={{ margin: 0 }}>{currentList.data.name}</Title>
                    </div>
                }
            >
                <div>
                    {currentList.data.description && (
                        <Text style={{ display: 'block', marginBottom: '16px' }}>
                            {currentList.data.description}
                        </Text>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <Text type="secondary">Created by: {currentList.data.created_by}</Text>
                        <Text type="secondary">{currentList.data.items.length} movies</Text>
                    </div>

                    {currentList.data.items.length === 0 ? (
                        <Empty description="This list is empty" />
                    ) : (
                        <Row gutter={[24, 24]}>
                            {currentList.data.items.map(movie => (
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