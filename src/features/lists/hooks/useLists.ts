import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {useAuth} from '@/features/auth';
import {
    addMovieToList,
    clearListsOperation,
    createList,
    deleteList,
    fetchListDetails,
    fetchUserLists,
    removeMovieFromList,
    updateList
} from '../stores/listsSlice';
import {CreateListRequest} from '../types';

export const useLists = () => {
    const dispatch = useAppDispatch();
    const { user, sessionId } = useAuth();
    const lists = useAppSelector(state => state.lists);

    const getUserLists = useCallback(() => {
        if (user && sessionId) {
            return dispatch(fetchUserLists({ accountId: user.id, sessionId }));
        }
        return Promise.reject('User not authenticated');
    }, [dispatch, user, sessionId]);

    const getListDetails = useCallback((listId: number) => {
        return dispatch(fetchListDetails(listId));
    }, [dispatch]);

    const createNewList = useCallback((listData: CreateListRequest) => {
        if (sessionId) {
            return dispatch(createList({ sessionId, listData }));
        }
        return Promise.reject('User not authenticated');
    }, [dispatch, sessionId]);
    const updateExistingList = useCallback(({ listId, name, description }: { listId: number, name: string, description: string }) => {
        return dispatch(updateList({ listId, name, description }));
    }, [dispatch]);
    const addToList = useCallback((listId: number, mediaId: number) => {
        if (sessionId) {
            return dispatch(addMovieToList({
                listId,
                sessionId,
                movieData: { media_id: mediaId }
            }));
        }
        return Promise.reject('User not authenticated');
    }, [dispatch, sessionId]);

    const removeFromList = useCallback((listId: number, mediaId: number) => {
        if (sessionId) {
            return dispatch(removeMovieFromList({
                listId,
                sessionId,
                movieData: { media_id: mediaId }
            }));
        }
        return Promise.reject('User not authenticated');
    }, [dispatch, sessionId]);

    const removeList = useCallback((listId: number) => {
        if (sessionId) {
            return dispatch(deleteList({ listId, sessionId }));
        }
        return Promise.reject('User not authenticated');
    }, [dispatch, sessionId]);

    const clearOperation = useCallback(() => {
        dispatch(clearListsOperation());
    }, [dispatch]);

    return {
        userLists: lists.userLists,
        currentList: lists.currentList,
        operations: lists.operations,
        getUserLists,
        updateList: updateExistingList,
        getListDetails,
        createList: createNewList,
        addMovieToList: addToList,
        removeMovieFromList: removeFromList,
        deleteList: removeList,
        clearOperation
    };
};