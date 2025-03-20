// src/services/api/listApi.ts
import axios from 'axios';
import { List, CreateListRequest, AddMovieRequest, MovieList } from '../../types/list.types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';

// Create instance with defaults
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export const listApi = {
    // Get user's lists
    getUserLists: async (accountId: number, sessionId: string): Promise<{ results: List[] }> => {
        const response = await api.get(`/account/${accountId}/lists`, {
            params: { session_id: sessionId }
        });
        return response.data;
    },

    // Get list details
    getListDetails: async (listId: number): Promise<MovieList> => {
        const response = await api.get(`/list/${listId}`);
        return response.data;
    },

    // Create a list
    createList: async (sessionId: string, listData: CreateListRequest): Promise<{ list_id: number, status_message: string, success: boolean }> => {
        const response = await api.post('/list', listData, {
            params: { session_id: sessionId }
        });
        return response.data;
    },

    // Add movie to list
    addMovieToList: async (listId: number, sessionId: string, movieData: AddMovieRequest): Promise<{ status_message: string, success: boolean }> => {
        const response = await api.post(`/list/${listId}/add_item`, movieData, {
            params: { session_id: sessionId }
        });
        return response.data;
    },

    // Remove movie from list
    removeMovieFromList: async (listId: number, sessionId: string, movieData: AddMovieRequest): Promise<{ status_message: string, success: boolean }> => {
        const response = await api.post(`/list/${listId}/remove_item`, movieData, {
            params: { session_id: sessionId }
        });
        return response.data;
    },

    // Delete a list
    deleteList: async (listId: number, sessionId: string): Promise<{ status_message: string, success: boolean }> => {
        const response = await api.delete(`/list/${listId}`, {
            params: { session_id: sessionId }
        });
        return response.data;
    }
};