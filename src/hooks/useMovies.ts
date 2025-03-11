import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchMovieDetails, fetchTrendingMovies } from '@/stores/slices/moviesSlice';

export const useMovies = () => {
    const dispatch = useAppDispatch();
    const { trending, selectedMovie, status, error } = useAppSelector((state) => state.movies);

    const getTrending = (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
        dispatch(fetchTrendingMovies({ mediaType, timeWindow }));
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