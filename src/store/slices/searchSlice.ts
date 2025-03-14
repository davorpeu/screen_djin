import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/api/tmdb';
import { Movie, SearchResults } from '../../types/movie.types';

interface SearchState {
    results: Movie[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: SearchState = {
    results: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1
};

export const searchMovies = createAsyncThunk(
    'search/searchMovies',
    async (query: string, { rejectWithValue }) => {
        try {
            return await tmdbApi.searchMovies(query);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.results = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMovies.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.loading = false;
                state.results = action.payload.results as Movie[];
                state.totalPages = action.payload.total_pages;
                state.currentPage = action.payload.page;
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to search movies';
                state.results = [];
            });
    }
});

export const { clearSearch } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;