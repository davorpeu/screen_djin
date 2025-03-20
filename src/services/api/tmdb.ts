import axios from 'axios';
import { SearchResults, MovieDetails, } from '../../types/movie.types';
import {AuthRequest} from "../../types/auth.types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';

// Create instance with defaults
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

export const tmdbApi = {

    validateToken: async (credentials: AuthRequest) => {
        const response = await api.post('/authentication/token/validate_with_login', credentials);
        return response.data;
    },
    createSession: async (requestToken: string) => {
        const response = await api.post('/authentication/session/new', { request_token: requestToken });
        return response.data;
    },
    // Movies endpoints
    getPopularMovies: async (page = 1): Promise<SearchResults> => {
        const response = await api.get('/movie/popular', { params: { page } });
        return response.data;
    },

    getTopRatedMovies: async (page = 1): Promise<SearchResults> => {
        const response = await api.get('/movie/top_rated', { params: { page } });
        return response.data;
    },
    getMovieReviews: async (id: number, page = 1) => {
        const response = await api.get(`/movie/${id}/reviews`, {
            params: { page }
        });
        return response.data;
    },
    getMovieDetails: async (id: number): Promise<MovieDetails> => {
        const response = await api.get(`/movie/${id}`, {
            params: { append_to_response: 'videos,credits,reviews' },
        });
        return response.data;
    },

    getMoviesByGenre: async (genreId: number, page = 1): Promise<SearchResults> => {
        const response = await api.get('/discover/movie', {
            params: { with_genres: genreId, page },
        });
        return response.data;
    },
    getMovieVideos: async (id: number) => {
        const response = await api.get(`/movie/${id}/videos`);
        return response.data;
    },


    // Search endpoints
    searchMovies: async (query: string, page = 1): Promise<SearchResults> => {
        const response = await api.get('/search/movie', { params: { query, page } });
        return response.data;
    },

    searchTVShows: async (query: string, page = 1): Promise<SearchResults> => {
        const response = await api.get('/search/tv', { params: { query, page } });
        return response.data;
    },

    searchMulti: async (query: string, page = 1): Promise<SearchResults> => {
        const response = await api.get('/search/multi', { params: { query, page } });
        return response.data;
    },
};