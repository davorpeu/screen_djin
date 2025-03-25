import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {moviesApi} from '../api/moviesApi';
import {SearchState} from '@/types/movie';
import {toast} from "react-toastify";

const initialState: SearchState = {
    results: [],
    loading: false,
    error: null,
    total_pages: 0,
    currentPage: 1
};

export const searchMovies = createAsyncThunk(
    'search/searchMovies',
    async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
        try {
            const response = await moviesApi.searchMovies(query, page);
            if (response.error) {
                toast.error(response.error)
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            toast.error(error.message)
            return rejectWithValue(error.message || 'Failed to search movies');
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
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload.results;
                state.total_pages = action.payload.total_pages;
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
export default searchSlice.reducer;