import React, {useEffect, useState} from 'react';
import {Form, message} from 'antd';
import {useLists} from '@/features/lists';
import {ListsView} from './ListsView';
import {CreateListRequest, List, MovieList, UpdateListRequest} from '../types';
import {toast} from "react-toastify";


export const ListsContainer: React.FC = () => {
    const {
        userLists,
        currentList,
        operations,
        getUserLists,
        getListDetails,
        createList,
        updateList,
        deleteList,
        addMovieToList,
        removeMovieFromList,
        clearOperation
    } = useLists();

    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentEditingList, setCurrentEditingList] = useState<MovieList | null>(null);
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

            if (currentEditingList && editModalVisible) {
                getListDetails(currentEditingList.id);
            }

            clearOperation();
        } else if (operations.error) {
            message.error(operations.error);
            clearOperation();
        }
    }, [operations.success, operations.message, operations.error, getUserLists, clearOperation, currentEditingList, editModalVisible, getListDetails]);

    useEffect(() => {
        if (currentList.data && editModalVisible) {
            setCurrentEditingList(currentList.data);
        }
    }, [currentList.data, editModalVisible]);

    const handleShowCreateModal = () => {
        createForm.resetFields();
        setCreateModalVisible(true);
    };

    const handleHideCreateModal = () => {
        setCreateModalVisible(false);
    };

    const handleCreateList = (values: CreateListRequest) => {
        createList({
            name: values.name,
            description: values.description,
            language: 'en'
        });
        setCreateModalVisible(false);
        toast.success("Bam! Movie List Added");
    };

    const handleShowEditModal = async (list: List) => {
        await getListDetails(list.id);

        editForm.setFieldsValue({
            id: list.id,
            name: list.name,
            description: list.description
        });

        setEditModalVisible(true);
    };

    const handleHideEditModal = () => {
        setEditModalVisible(false);
        setCurrentEditingList(null);
    };

    const handleUpdateList = (values: UpdateListRequest) => {
        updateList({
            listId: values.id,
            name: values.name,
            description: values.description
        });
    };

    const handleDeleteList = (listId: number) => {
        deleteList(listId);
        toast.success("Bam! Movie List Removed");

    };

    const handleAddMovieToList = (listId: number, movieId: number) => {
        addMovieToList(listId, movieId);
        toast.success("Bam! Movie added");

    };

    const handleRemoveMovieFromList = (listId: number, movieId: number) => {
        removeMovieFromList(listId, movieId);
        toast.success("Bam! Movie removed");

    };

    return (
        <ListsView
            lists={userLists.items || []}
            loading={userLists.loading}
            error={userLists.error}
            operationLoading={operations.loading}
            currentEditingList={currentEditingList}
            createModalVisible={createModalVisible}
            editModalVisible={editModalVisible}
            createForm={createForm}
            editForm={editForm}
            onShowCreateModal={handleShowCreateModal}
            onHideCreateModal={handleHideCreateModal}
            onCreateList={handleCreateList}
            onShowEditModal={handleShowEditModal}
            onHideEditModal={handleHideEditModal}
            onUpdateList={handleUpdateList}
            onDeleteList={handleDeleteList}
            onAddMovieToList={handleAddMovieToList}
            onRemoveMovieFromList={handleRemoveMovieFromList}
        />
    );
};