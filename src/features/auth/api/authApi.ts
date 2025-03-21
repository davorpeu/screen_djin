import axios from 'axios';
import {AuthTokenResponse, SessionResponse, User, ValidateTokenWithLoginRequest} from '../types';
import {API_URL} from '@/config';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const api = axios.create({
    baseURL: API_URL,
    params: {
        api_key: API_KEY,
    },
});

export const authApi = {
    getRequestToken: async (): Promise<AuthTokenResponse> => {
        const response = await api.get('/authentication/token/new');
        return response.data;
    },

    validateTokenWithLogin: async (credentials: ValidateTokenWithLoginRequest): Promise<AuthTokenResponse> => {
        const response = await api.post('/authentication/token/validate_with_login', credentials);
        return response.data;
    },

    createSession: async (request_token: string): Promise<SessionResponse> => {
        const response = await api.post('/authentication/session/new', { request_token });
        return response.data;
    },

    deleteSession: async (session_id: string): Promise<{ success: boolean }> => {
        const response = await api.delete('/authentication/session', {
            data: { session_id }
        });
        return response.data;
    },

    getAccountDetails: async (session_id: string): Promise<User> => {
        const response = await api.get('/account', {
            params: { session_id }
        });
        return {
            id: response.data.id,
            username: response.data.username || 'User',
            name: response.data.name || 'User',
            avatar: response.data.avatar?.tmdb?.avatar_path || null
        };
    }
};