// src/services/api/tmdb.ts
import axios from 'axios';
import { Movie, TvShow, SearchResults, MovieDetails, TvShowDetails } from 'types/movie.types';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_TMDB_API_URL,
    params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
    },
});

export const tmdbApi = {
    // Movies
    getPopularMovies: async (page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/movie/popular', { params: { page } });
        return response.data;
    },

    getTopRatedMovies: async (page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/movie/top_rated', { params: { page } });
        return response.data;
    },

    getMovieDetails: async (id: number): Promise<MovieDetails> => {
        const response = await apiClient.get<MovieDetails>(`/movie/${id}`, {
            params: { append_to_response: 'videos,credits,reviews' }
        });
        return response.data;
    },

    // TV Shows
    getPopularTvShows: async (page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/tv/popular', { params: { page } });
        return response.data;
    },

    getTopRatedTvShows: async (page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/tv/top_rated', { params: { page } });
        return response.data;
    },

    getTvShowDetails: async (id: number): Promise<TvShowDetails> => {
        const response = await apiClient.get<TvShowDetails>(`/tv/${id}`, {
            params: { append_to_response: 'videos,credits,reviews' }
        });
        return response.data;
    },

    // Search
    searchMulti: async (query: string, page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/search/multi', {
            params: { query, page }
        });
        return response.data;
    },

    // Genres
    getMovieGenres: async () => {
        const response = await apiClient.get('/genre/movie/list');
        return response.data.genres;
    },

    getTvGenres: async () => {
        const response = await apiClient.get('/genre/tv/list');
        return response.data.genres;
    },

    // By genre
    getMoviesByGenre: async (genreId: number, page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/discover/movie', {
            params: { with_genres: genreId, page }
        });
        return response.data;
    },

    getTvShowsByGenre: async (genreId: number, page = 1): Promise<SearchResults> => {
        const response = await apiClient.get<SearchResults>('/discover/tv', {
            params: { with_genres: genreId, page }
        });
        return response.data;
    }
};