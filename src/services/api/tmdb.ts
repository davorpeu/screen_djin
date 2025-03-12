// src/services/api/tmdb.ts
import axios, { AxiosError } from 'axios';

// Define API response types
interface ApiResponse<T> {
    results: T[];
    page: number;
    total_pages: number;
}

// Define movie types
interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
}

// Create API client with proper error handling
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_TMDB_API_URL,
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
    },
});

// API endpoints
export const tmdbApi = {
    // Get popular movies
    getPopularMovies: async (page: number = 1): Promise<ApiResponse<Movie>> => {
        try {
            const response = await apiClient.get('/movie/popular', { params: { page } });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch popular movies: ${error.message}`);
        }
    },

    // Get top rated movies
    getTopRatedMovies: async (page: number = 1): Promise<ApiResponse<Movie>> => {
        try {
            const response = await apiClient.get('/movie/top_rated', { params: { page } });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch top rated movies: ${error.message}`);
        }
    },

    // Get movie details
    getMovieDetails: async (movieId: number): Promise<Movie> => {
        try {
            const response = await apiClient.get(`/movie/${movieId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch movie details: ${error.message}`);
        }
    },

    // Search movies
    searchMulti: async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
        try {
            const response = await apiClient.get('/search/multi', {
                params: {
                    query,
                    page,
                    include_adult: false
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to search movies: ${error.message}`);
        }
    },

    // Get movies by genre
    getMoviesByGenre: async (genreId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
        try {
            const response = await apiClient.get('/discover/movie', {
                params: {
                    with_genres: genreId,
                    page
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch movies by genre: ${error.message}`);
        }
    }
};