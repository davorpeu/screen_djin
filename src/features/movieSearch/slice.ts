
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MovieState } from '../shared/types';

const initialState: MovieState = {
    movies: [],
    loading: false,
    error: null,
    currentPage: 1,
    total_pages: 1,
    searchTerm: '',
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setMovies(state, action: PayloadAction<Movie[]>) {
            state.movies = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setTotalPages(state, action: PayloadAction<number>) {
            state.total_pages = action.payload;
        },
    },
});

export const {
    setSearchTerm,
    setCurrentPage,
    setMovies,
    setLoading,
    setError,
    setTotalPages,
} = movieSlice.actions;

export default movieSlice.reducer;