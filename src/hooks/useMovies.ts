import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchMovieDetails, fetchPopularMovies } from '../store/slices/movieSlice';

export const useMovies = () => {
    const dispatch = useAppDispatch();
    const { trending, selectedMovie, status, error } = useAppSelector((state) => state.movies);

    const getTrending = (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
        dispatch(fetchPopularMovies({ mediaType, timeWindow }));
    };

    const getMovieDetails = (id: number, mediaType: 'movie' | 'tv') => {
        dispatch(fetchMovieDetails({ id, mediaType }));
    };

    return {
        trending,
        selectedMovie,
        status,
        error,
        getTrending,
        getMovieDetails,
    };
};