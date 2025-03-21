import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {
    fetchMovieDetails,
    fetchMovieReviews,
    fetchMoviesByGenre,
    fetchMovieTrailers,
    fetchPopularMovies,
    fetchTopRatedMovies
} from '../stores/moviesSlice';
import {clearSearch, searchMovies} from '../stores/searchSlice';

export const useMovies = () => {
    const dispatch = useAppDispatch();
    const movies = useAppSelector(state => state.movies);
    const search = useAppSelector(state => state.search);

    const getPopularMovies = useCallback((page = 1) => {
        return dispatch(fetchPopularMovies(page));
    }, [dispatch]);

    const getTopRatedMovies = useCallback((page = 1) => {
        return dispatch(fetchTopRatedMovies(page));
    }, [dispatch]);

    const getMovieDetails = useCallback((id: number) => {
        return dispatch(fetchMovieDetails(id));
    }, [dispatch]);

    const getMovieTrailers = useCallback((id: number) => {
        return dispatch(fetchMovieTrailers(id));
    }, [dispatch]);

    const getMovieReviews = useCallback((movieId: number, page = 1) => {
        return dispatch(fetchMovieReviews({ movieId, page }));
    }, [dispatch]);

    const getMoviesByGenre = useCallback((genreId: number, page = 1) => {
        return dispatch(fetchMoviesByGenre({ genreId, page }));
    }, [dispatch]);

    const searchForMovies = useCallback((query: string, page = 1) => {
        return dispatch(searchMovies({ query, page }));
    }, [dispatch]);

    const clearSearchResults = useCallback(() => {
        return dispatch(clearSearch());
    }, [dispatch]);

    return {
        movies: {
            popular: movies.popular,
            topRated: movies.topRated,
            movieDetails: movies.movieDetails,
            byGenre: movies.byGenre,
        },
        search: {
            results: search.results,
            loading: search.loading,
            error: search.error,
            total_pages: search.total_pages,
            currentPage: search.currentPage
        },
        getPopularMovies,
        getTopRatedMovies,
        getMovieDetails,
        getMovieTrailers,
        getMovieReviews,
        getMoviesByGenre,
        searchForMovies,
        clearSearchResults
    };
};