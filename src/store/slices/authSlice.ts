// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/api/tmdb';
import { SessionState, AuthRequest } from '../../types/auth.types';

const initialState: SessionState = {
    sessionId: null,
    requestToken: null,
    loading: false,
    error: null,
};

export const requestToken = createAsyncThunk(
    'auth/requestToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await tmdbApi.requestToken();
            return response.request_token;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: AuthRequest, { rejectWithValue }) => {
        try {
          //  const response = await tmdbApi.validateToken(credentials);
         //   const sessionId = await tmdbApi.createSession(response.request_token);
            //return sessionId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.sessionId = null;
            state.requestToken = null;
            localStorage.removeItem('tmdbSession');
        },
        restoreSession: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Request token
            .addCase(requestToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestToken.fulfilled, (state, action) => {
                state.loading = false;
                state.requestToken = action.payload;
            })
            .addCase(requestToken.rejected, (state, action) => {
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
                state.sessionId = action.payload;
                localStorage.setItem('tmdbSession', action.payload);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to login';
            });
    }
});

export const { logout, restoreSession } = authSlice.actions;
export const authReducer = authSlice.reducer;