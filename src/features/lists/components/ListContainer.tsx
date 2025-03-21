import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Col, Empty, Form, Input, message, Modal, Row, Spin, Tooltip, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined, LoadingOutlined} from '@ant-design/icons';
import {useLists} from '@/features/lists';
import {IMAGE_BASE_URL, POSTER_SIZES} from '@/config';
import {CreateListRequest} from '../types';

const { Title, Text } = Typography;

export const ListContainer: React.FC = () => {
    const {
        userLists,
        operations,
        getUserLists,
        createList: createNewList,
        deleteList,
        clearOperation
    } = useLists();

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        getUserLists();

        return () => {
            clearOperation();
        };
    }, [getUserLists, clearOperation]);

    useEffect(() => {
        if (operations.success) {
            message.success(operations.message || 'Operation successful');
            getUserLists();
            clearOperation();
        } else if (operations.error) {
            message.error(operations.error);
            clearOperation();
        }
    }, [operations.success, operations.message, operations.error, getUserLists, clearOperation]);

    const showCreateModal = () => {
        form.resetFields();
        setCreateModalVisible(true);
    };

    const handleCreateList = (values: CreateListRequest) => {
        createNewList({
            name: values.name,
            description: values.description,
            language: 'en'
        });
        setCreateModalVisible(false);
    };

    const handleDeleteList = (listId: number) => {
        Modal.confirm({
            title: 'Delete List',
            content: 'Are you sure you want to delete this list? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                deleteList(listId);
            }
        });
    };

    if (userLists.loading) {
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
                    <Button type="primary" onClick={showCreateModal}>Create New List</Button>
                </div>

                {userLists.error && (
                    <Empty
                        description={<>
                            <Text type="danger">{userLists.error}</Text>
                            <div style={{ marginTop: '8px' }}>Please try again later</div>
                        </>}
                    />
                )}

                {!userLists.error && (!userLists.items || userLists.items.length === 0) ? (
                    <Empty
                        description="You haven't created any lists yet"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button type="primary" onClick={showCreateModal}>Create Your First List</Button>
                    </Empty>
                ) : (
                    <Row gutter={[24, 24]}>
                        {userLists.items.map(list => (
                            <Col xs={24} sm={12} md={8} key={list.id}>
                                <Card
                                    hoverable
                                    cover={list.poster_path ? (
                                        <img
                                            alt={list.name}
                                            src={`${IMAGE_BASE_URL}/${POSTER_SIZES.medium}${list.poster_path}`}
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
                                        <Tooltip title="View List" key="view">
                                            <Link to={`/list/${list.id}`}>
                                                <EyeOutlined />
                                            </Link>
                                        </Tooltip>,
                                        <Tooltip title="Edit List" key="edit">
                                            <Link to={`/list/${list.id}/edit`}>
                                                <EditOutlined />
                                            </Link>
                                        </Tooltip>,
                                        <Tooltip title="Delete List" key="delete">
                                            <DeleteOutlined
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
                            loading={operations.loading}
                        >
                            Create
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
