import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Layout, Row, Spin, Typography, Modal, Input } from 'antd';
import { ArrowLeftOutlined, LoadingOutlined, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
import { MovieCard } from '@/features/movies';
import { MovieList } from '../types';

const { Content } = Layout;
const { Title, Text } = Typography;

interface ListDetailViewProps {
    // Data props
    list: MovieList | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    shareUrl: string;

    // State props
    shareModalVisible: boolean;
    copied: boolean;

    // Event handlers
    onShowShareModal: () => void;
    onHideShareModal: () => void;
    onCopyToClipboard: () => void;
}

export const ListDetailView: React.FC<ListDetailViewProps> = ({
                                                                  list,
                                                                  loading,
                                                                  error,
                                                                  isAuthenticated,
                                                                  shareUrl,
                                                                  shareModalVisible,
                                                                  copied,
                                                                  onShowShareModal,
                                                                  onHideShareModal,
                                                                  onCopyToClipboard
                                                              }) => {
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
            {isAuthenticated ? (
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
                    <Breadcrumb.Item>{list.name}</Breadcrumb.Item>
                </Breadcrumb>
            ) : (<div></div>
            )}

            <Card
                style={{ marginBottom: '24px' }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {isAuthenticated ? (
                                <Link to="/" style={{ marginRight: '16px' }}>
                                    <Button icon={<ArrowLeftOutlined />}>Back</Button>
                                </Link>
                            ) : (<div></div>
                            )}
                            <Title level={3} style={{ margin: 0 }}>{list.name}</Title>
                        </div>
                        <Button
                            type="primary"
                            icon={<ShareAltOutlined />}
                            onClick={onShowShareModal}
                        >
                            Share
                        </Button>
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

            {/* Share Modal */}
            <Modal
                title="Share this list"
                open={shareModalVisible}
                onCancel={onHideShareModal}
                footer={[
                    <Button key="close" onClick={onHideShareModal}>
                        Close
                    </Button>
                ]}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>Share this list with friends:</p>
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 40px)' }}
                            value={shareUrl}
                            readOnly
                        />
                        <Button
                            icon={copied ? <CopyOutlined style={{ color: 'green' }} /> : <CopyOutlined />}
                            onClick={onCopyToClipboard}
                            style={{ width: '40px' }}
                        />
                    </Input.Group>
                </div>
                <div>
                    <p>You can also share via:</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button
                            type="primary"
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this movie list: ${list.name}`)}`}
                            target="_blank"
                            style={{ background: '#1DA1F2', borderColor: '#1DA1F2' }}
                        >
                            Twitter
                        </Button>
                        <Button
                            type="primary"
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            style={{ background: '#4267B2', borderColor: '#4267B2' }}
                        >
                            Facebook
                        </Button>
                        <Button
                            type="primary"
                            href={`mailto:?subject=${encodeURIComponent(`Movie List: ${list.name}`)}&body=${encodeURIComponent(`Check out this movie list: ${shareUrl}`)}`}
                            style={{ background: '#5F9EA0', borderColor: '#5F9EA0' }}
                        >
                            Email
                        </Button>
                    </div>
                </div>
            </Modal>
        </Content>
    );
};