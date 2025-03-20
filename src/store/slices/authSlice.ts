// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {authApi, getAccountDetails, ValidateTokenWithLoginRequest} from '../../services/api/auth';

interface UserDetails {
    id: number;
    username: string;
    name: string;
    avatar?: string;
}

export interface AuthState {
    sessionId: string | null;
    requestToken: string | null;
    user: UserDetails | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    sessionId: localStorage.getItem('tmdbSession') || null,
    requestToken: null,
    user: localStorage.getItem('tmdbUser') || null,
    isAuthenticated: !!localStorage.getItem('tmdbSession'),
    loading: false,
    error: null,
};

// Step 1: Get a request token
export const getRequestToken = createAsyncThunk(
    'auth/getRequestToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getRequestToken();
            return response.request_token;
        } catch (error) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to get request token');
        }
    }
);

// Step 2 & 3: Login with credentials and create session
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { dispatch, getState, rejectWithValue }) => {
        try {
            // Get current state
            const state = getState() as { auth: AuthState };
            let token = state.auth.requestToken;

            // If no token exists, request one first
            if (!token) {
                const tokenAction = await dispatch(getRequestToken());
                if (getRequestToken.rejected.match(tokenAction)) {
                    return rejectWithValue('Failed to get request token');
                }
                token = tokenAction.payload as string;
            }

            // Validate token with login
            const loginRequest: ValidateTokenWithLoginRequest = {
                username: credentials.username,
                password: credentials.password,
                request_token: token
            };

            const validatedToken = await authApi.validateTokenWithLogin(loginRequest);

            // Create session with validated token
            const session = await authApi.createSession(validatedToken.request_token);

            // Get user account details
            const userDetails = await authApi.getAccountDetails(session.session_id);

            return {
                sessionId: session.session_id,
                user: {
                    id: userDetails.id,
                    username: credentials.username,
                    name: userDetails.name || credentials.username,
                    avatar: userDetails.avatar?.tmdb?.avatar_path || null
                }
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.status_message || 'Login failed. Please check your credentials.'
            );
        }
    }
);
export const fetchAccountDetails = createAsyncThunk(
    'auth/fetchAccountDetails',
    async (sessionId: string, { rejectWithValue }) => {
        try {
            return await getAccountDetails(sessionId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch account details');
        }
    }
);
// Logout and destroy session
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            if (state.auth.sessionId) {
                await authApi.deleteSession(state.auth.sessionId);
            }
            localStorage.removeItem('tmdbSession');
            localStorage.removeItem('tmdbUser');
            return true;
        } catch (error) {
            return rejectWithValue('Failed to logout');
        }
    }
);

// Restore session from localStorage
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (sessionId: string, { rejectWithValue }) => {
        try {
            const userDetails = await authApi.getAccountDetails(sessionId);
            return {
                sessionId,
                user: {
                    id: userDetails.id,
                    username: userDetails.username || 'User',
                    name: userDetails.name || 'User',
                    avatar: userDetails.avatar?.tmdb?.avatar_path || null
                }
            };
        } catch (error) {
            localStorage.removeItem('tmdbSession');
            localStorage.removeItem('tmdbUser');
            return rejectWithValue('Session expired or invalid');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Request Token
            .addCase(getRequestToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRequestToken.fulfilled, (state, action) => {
                state.loading = false;
                state.requestToken = action.payload;
            })
            .addCase(getRequestToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to get request token';
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionId = action.payload.sessionId;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('tmdbSession', action.payload.sessionId);
                localStorage.setItem('tmdbUser', JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Login failed';
                state.isAuthenticated = false;
            })
            .addCase(fetchAccountDetails.fulfilled, (state, action) => {
                state.user = {
                    id: action.payload.id,
                    username: action.payload.username,
                    name: action.payload.name,
                    avatar: action.payload.avatar?.tmdb?.avatar_path
                };
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.sessionId = null;
                state.requestToken = null;
                state.user = null;
                state.isAuthenticated = false;
            })

            // Restore Session
            .addCase(restoreSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionId = action.payload.sessionId;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(restoreSession.rejected, (state, action) => {
                state.loading = false;
                state.sessionId = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string || 'Session restoration failed';
            });
    }
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;