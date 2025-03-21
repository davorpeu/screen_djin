import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authApi} from '../api/authApi';
import {AuthState, LoginCredentials, User, ValidateTokenWithLoginRequest} from '../types';
import {RootState} from '@/stores';

const initialState: AuthState = {
    sessionId: localStorage.getItem('tmdbSession') || null,
    requestToken: null,
    user: JSON.parse(localStorage.getItem('tmdbUser') || 'null'),
    isAuthenticated: !!localStorage.getItem('tmdbSession'),
    loading: false,
    error: null,
};

export const getRequestToken = createAsyncThunk(
    'auth/getRequestToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authApi.getRequestToken();
            return response.request_token;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to get request token');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { dispatch, getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            let token = state.auth.requestToken;

            if (!token) {
                const tokenAction = await dispatch(getRequestToken());
                if (getRequestToken.rejected.match(tokenAction)) {
                    return rejectWithValue('Failed to get request token');
                }
                token = tokenAction.payload as string;
            }

            const loginRequest: ValidateTokenWithLoginRequest = {
                username: credentials.username,
                password: credentials.password,
                request_token: token
            };

            const validatedToken = await authApi.validateTokenWithLogin(loginRequest);

            const session = await authApi.createSession(validatedToken.request_token);

            const userDetails = await authApi.getAccountDetails(session.session_id);

            return {
                sessionId: session.session_id,
                user: userDetails
            };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.status_message || 'Login failed. Please check your credentials.'
            );
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            if (state.auth.sessionId) {
                await authApi.deleteSession(state.auth.sessionId);
            }
            localStorage.removeItem('tmdbSession');
            localStorage.removeItem('tmdbUser');
            return true;
        } catch (error: any) {
            return rejectWithValue('Failed to logout');
        }
    }
);

export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (sessionId: string, { rejectWithValue }) => {
        try {
            const userDetails = await authApi.getAccountDetails(sessionId);
            return {
                sessionId,
                user: userDetails
            };
        } catch (error: any) {
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

            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ sessionId: string; user: User }>) => {
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

            .addCase(logout.fulfilled, (state) => {
                state.sessionId = null;
                state.requestToken = null;
                state.user = null;
                state.isAuthenticated = false;
            })

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
export default authSlice.reducer;