import {get} from '@/services/api/client';
import {MovieDetails, SearchResults} from '@/types/movie';

export const moviesApi = {
    getPopularMovies: async (page = 1) => {
        return get<SearchResults>('/movie/popular', { page });
    },

    getTopRatedMovies: async (page = 1) => {
        return get<SearchResults>('/movie/top_rated', { page });
    },

    getMovieDetails: async (id: number) => {
        return get<MovieDetails>(`/movie/${id}`, {
            append_to_response: 'videos,credits,reviews'
        });
    },

    getMovieVideos: async (id: number) => {
        return get<{ id: number, results: any[] }>(`/movie/${id}/videos`);
    },

    getMovieReviews: async (id: number, page = 1) => {
        return get<{ id: number, page: number, results: any[], total_pages: number, total_results: number }>(`/movie/${id}/reviews`, { page });
    },

    getMoviesByGenre: async (genreId: number, page = 1) => {
        return get<SearchResults>('/discover/movie', { with_genres: genreId, page });
    },

    searchMovies: async (query: string, page = 1) => {
        return get<SearchResults>('/search/movie', { query, page });
    },
};