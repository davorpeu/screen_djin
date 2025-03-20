// src/services/api/auth.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';

// Create instance with defaults
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export interface AuthTokenResponse {
    success: boolean;
    expires_at: string;
    request_token: string;
}

export interface SessionResponse {
    success: boolean;
    session_id: string;
}

export interface ValidateTokenWithLoginRequest {
    username: string;
    password: string;
    request_token: string;
}

export const authApi = {
    // Step 1: Request a new token
    getRequestToken: async (): Promise<AuthTokenResponse> => {
        const response = await api.get('/authentication/token/new');
        return response.data;
    },

    // Step 2: Validate the token with login
    validateTokenWithLogin: async (credentials: ValidateTokenWithLoginRequest): Promise<AuthTokenResponse> => {
        const response = await api.post('/authentication/token/validate_with_login', credentials);
        return response.data;
    },

    // Step 3: Create a session
    createSession: async (request_token: string): Promise<SessionResponse> => {
        const response = await api.post('/authentication/session/new', { request_token });
        return response.data;
    },

    // Delete the session when logging out
    deleteSession: async (session_id: string): Promise<{ success: boolean }> => {
        const response = await api.delete('/authentication/session', {
            data: { session_id }
        });
        return response.data;
    },

    // Get account details
    getAccountDetails: async (session_id: string): Promise<any> => {
        const response = await api.get('/account', {
            params: { session_id }
        });
        return response.data;
    }
};export const getAccountDetails = async (sessionId: string) => {
    const response = await axios.get(`${BASE_URL}/account`, {
        params: { api_key: API_KEY, session_id: sessionId }
    });
    return response.data;
};