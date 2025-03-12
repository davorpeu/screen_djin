// features/movieSearch/api.ts
import axios from 'axios';
import { MovieList } from '../shared/types';

export interface TMDBConfig {
    apiKey: string;
    baseUrl: string;
}

export class MovieAPI {
    private config: TMDBConfig;

    constructor(config: TMDBConfig) {
        this.config = config;
    }

    async fetchMovies(query: string, page: number = 1): Promise<MovieList> {
        const url = `${this.config.baseUrl}/search/multi?api_key=${this.config.apiKey}&query=${query}&page=${page}`;
        const response = await axios.get<MovieList>(url);
        return response.data;
    }
}

// features/movieSearch/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieAPI } from './api';
import { MovieState } from '../shared/types';

const initialState: MovieState = {
    movies: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
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
            state.totalPages = action.payload;
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