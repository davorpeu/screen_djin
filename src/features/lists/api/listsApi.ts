import {del, get, post} from '@/services/api/client';
import {AddMovieRequest, CreateListRequest, List, MovieList} from '../types';

export const listsApi = {
    getUserLists: async (accountId: number, sessionId: string) => {
        return get<{ results: List[] }>(`/account/${accountId}/lists`, { session_id: sessionId });
    },

    getListDetails: async (listId: number) => {
        return get<MovieList>(`/list/${listId}`);
    },

    createList: async (sessionId: string, listData: CreateListRequest) => {
        return post<{ list_id: number, status_message: string, success: boolean }>(
            '/list',
            listData,
            { session_id: sessionId }
        );
    },
    updateList: async (listId: number, sessionId: string, listData: { name: string; description: string }) => {
        return post<{ status_message: string, success: boolean }>(
            `/list/${listId}`,
            listData,
            { session_id: sessionId }
        );
    },
    addMovieToList: async (listId: number, sessionId: string, movieData: AddMovieRequest) => {
        return post<{ status_message: string, success: boolean }>(
            `/list/${listId}/add_item`,
            movieData,
            { session_id: sessionId }
        );
    },

    removeMovieFromList: async (listId: number, sessionId: string, movieData: AddMovieRequest) => {
        return post<{ status_message: string, success: boolean }>(
            `/list/${listId}/remove_item`,
            movieData,
            { session_id: sessionId }
        );
    },

    deleteList: async (listId: number, sessionId: string) => {
        return del<{ status_message: string, success: boolean }>(
            `/list/${listId}`,
            { session_id: sessionId }
        );
    }
};