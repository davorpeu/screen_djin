// src/store/slices/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/api/tmdb';
import { Movie, TvShow, SearchResults } from '../../types/movie.types';

// Define types for search state and filters
interface SearchState {
    results: (Movie | TvShow)[];
    page: number;
    total_pages: number;
    query: string;
    loading: boolean;
    error: string | null;
    filters: {
        type: 'all' | 'movie' | 'tv' | 'person';
        genre: number | null;
        year: number | null;
        rating: number | null;
    };
}

// Define initial state
const initialState: SearchState = {
    results: [],
    page: 1,
    total_pages: 0,
    query: '',
    loading: false,
    error: null,
    filters: {
        type: 'all',
        genre: null,
        year: null,
        rating: null,
    },
};

// Create async thunk for search
export const searchContent = createAsyncThunk(
    'search/searchContent',
    async ({ query, page = 1 }: { query: string; page?: number }) => {
        try {
            const data = await tmdbApi.searchMulti(query, page);
            return { ...data, query };
        } catch (error) {
            throw new Error('Failed to search content');
        }
    }
);

// Create slice with reducers and extra reducers
const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updateFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearSearch: (state) => {
            state.results = [];
            state.page = 1;
            state.total_pages = 0;
            state.query = '';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Pending state
            .addCase(searchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled state
            .addCase(searchContent.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload.results;
                state.page = action.payload.page;
                state.total_pages = action.payload.total_pages;
                state.query = action.payload.query;
            })
            // Rejected state
            .addCase(searchContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to search content';
            });
    },
});

// Export actions and reducer
export const { updateFilters, clearSearch } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;