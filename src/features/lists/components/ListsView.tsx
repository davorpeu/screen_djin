import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Col, Empty, Form, Input, Modal, Row, Spin, Tooltip, Typography} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined, LoadingOutlined} from '@ant-design/icons';
import {IMAGE_BASE_URL, POSTER_SIZES} from '@/config';
import {CreateListRequest, List, MovieList, UpdateListRequest} from '../types';
import {ListEditModal} from './ListEditModal';

const { Title, Text } = Typography;

interface ListsViewProps {
    lists: List[];
    loading: boolean;
    error: string | null;
    operationLoading: boolean;
    currentEditingList: MovieList | null;

    createModalVisible: boolean;
    editModalVisible: boolean;

    createForm: any;
    editForm: any;

    onShowCreateModal: () => void;
    onHideCreateModal: () => void;
    onCreateList: (values: CreateListRequest) => void;
    onShowEditModal: (list: List) => void;
    onHideEditModal: () => void;
    onUpdateList: (values: UpdateListRequest) => void;
    onDeleteList: (listId: number) => void;
    onAddMovieToList: (listId: number, movieId: number) => void;
    onRemoveMovieFromList: (listId: number, movieId: number) => void;
}

export const ListsView: React.FC<ListsViewProps> = ({
                                                        lists,
                                                        loading,
                                                        error,
                                                        operationLoading,
                                                        currentEditingList,
                                                        createModalVisible,
                                                        editModalVisible,
                                                        createForm,
                                                        editForm,
                                                        onShowCreateModal,
                                                        onHideCreateModal,
                                                        onCreateList,
                                                        onShowEditModal,
                                                        onHideEditModal,
                                                        onUpdateList,
                                                        onDeleteList,
                                                        onAddMovieToList,
                                                        onRemoveMovieFromList
                                                    }) => {
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
                    <Button type="primary" onClick={onShowCreateModal}>Create New List</Button>
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
                        <Button type="primary" onClick={onShowCreateModal}>Create Your First List</Button>
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
                                            <EditOutlined onClick={() => onShowEditModal(list)} />
                                        </Tooltip>,
                                        <Tooltip title="Delete List" key="delete">
                                            <DeleteOutlined onClick={() => onDeleteList(list.id)} />
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
                onCancel={onHideCreateModal}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={onCreateList}
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
                            onClick={onHideCreateModal}
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

            <ListEditModal
                visible={editModalVisible}
                list={currentEditingList}
                form={editForm}
                loading={operationLoading}
                onClose={onHideEditModal}
                onUpdate={onUpdateList}
                onAddMovie={onAddMovieToList}
                onRemoveMovie={onRemoveMovieFromList}
            />
        </div>
    );
};