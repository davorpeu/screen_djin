// src/features/lists/components/ListContainer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Empty, Modal, Form, Input, Spin, message, Tooltip } from 'antd';
import {  DeleteOutlined, EditOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchUserLists, createList, deleteList, clearListsOperation } from '../../../store/slices/listSlice';

const { Title, Text } = Typography;

export const ListContainer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, sessionId } = useAppSelector(state => state.auth);
    const { items: lists, loading, error } = useAppSelector(state => state.lists.userLists);
    const { loading: operationLoading, success, message: operationMessage, error: operationError } = useAppSelector(state => state.lists.operations);

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Fetch user lists when component mounts or becomes visible
    useEffect(() => {
        if (user && sessionId) {
            dispatch(fetchUserLists({ accountId: user.id, sessionId }));
        }

        // Cleanup function to clear operation state
        return () => {
            dispatch(clearListsOperation());
        };
    }, [dispatch, user, sessionId]);

    // Show success/error messages and refresh on operation completion
    useEffect(() => {
        if (success) {
            message.success(operationMessage || 'Operation successful');
            // Refresh lists after successful operation
            if (user && sessionId) {
                dispatch(fetchUserLists({ accountId: user.id, sessionId }));
            }
            // Clear operation state
            dispatch(clearListsOperation());
        } else if (operationError) {
            message.error(operationError);
            dispatch(clearListsOperation());
        }
    }, [success, operationMessage, operationError, dispatch, user, sessionId]);

    const showCreateModal = () => {
        form.resetFields();
        setCreateModalVisible(true);
    };

    const handleCreateList = (values: { name: string; description: string }) => {
        if (sessionId) {
            dispatch(createList({
                sessionId,
                listData: {
                    name: values.name,
                    description: values.description,
                    language: 'en'
                }
            }));
            setCreateModalVisible(false);
        } else {
            message.error('You must be logged in to create a list');
        }
    };

    const handleDeleteList = (listId: number) => {
        if (sessionId) {
            Modal.confirm({
                title: 'Delete List',
                content: 'Are you sure you want to delete this list? This action cannot be undone.',
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: () => {
                    dispatch(deleteList({ listId, sessionId }));
                }
            });
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} tip="Loading your lists..." />
            </div>
        );
    }

    return (
        <div>
            <Card style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={3} style={{ margin: 0 }}>My Movie Lists</Title>

                </div>

                {error && (
                    <Empty
                        description={<>
                            <Text type="danger">{error}</Text>
                            <div style={{ marginTop: '8px' }}>Please try again later</div>
                        </>}
                    />
                )}

                {!error && (!lists || lists.length === 0) ? (
                    <Empty
                        description="You haven't created any lists yet"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={showCreateModal}>Create Your First List</Button>
                    </Empty>
                ) : (
                    <Row gutter={[24, 24]}>
                        {lists.map(list => (
                            <Col xs={24} sm={12} md={8} key={list.id}>
                                <Card
                                    hoverable
                                    cover={list.poster_path ? (
                                        <img
                                            alt={list.name}
                                            src={`https://image.tmdb.org/t/p/w500${list.poster_path}`}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            height: '200px',
                                            background: 'linear-gradient(to right, #141e30, #243b55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{ color: 'white', fontSize: '18px' }}>{list.name}</Text>
                                        </div>
                                    )}
                                    actions={[
                                        <Tooltip title="View List">
                                            <Link to={`/list/${list.id}`}>
                                                <EyeOutlined key="view" />
                                            </Link>
                                        </Tooltip>,
                                        <Tooltip title="Edit List">
                                            <Link to={`/list/${list.id}/edit`}>
                                                <EditOutlined key="edit" />
                                            </Link>
                                        </Tooltip>,
                                        <Tooltip title="Delete List">
                                            <DeleteOutlined
                                                key="delete"
                                                onClick={() => handleDeleteList(list.id)}
                                            />
                                        </Tooltip>
                                    ]}
                                >
                                    <Card.Meta
                                        title={list.name}
                                        description={
                                            <>
                                                <p style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>{list.description}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Text type="secondary">{list.item_count} movies</Text>
                                                    <Text type="secondary">{list.favorite_count} likes</Text>
                                                </div>
                                            </>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Card>

            {/* Create List Modal */}
            <Modal
                title="Create New List"
                open={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateList}
                >
                    <Form.Item
                        name="name"
                        label="List Name"
                        rules={[
                            { required: true, message: 'Please enter a name for your list' },
                            { max: 50, message: 'Name cannot be longer than 50 characters' }
                        ]}
                    >
                        <Input placeholder="Enter list name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { max: 200, message: 'Description cannot be longer than 200 characters' }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter a description (optional)"
                            rows={4}
                        />
                    </Form.Item>

                    <div style={{ textAlign: 'right' }}>
                        <Button
                            style={{ marginRight: 8 }}
                            onClick={() => setCreateModalVisible(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={operationLoading}
                        >
                            Create
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};