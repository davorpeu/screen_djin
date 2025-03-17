// In your MovieDetails.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchMovieDetails } from '../../store/slices/movieSlice';

export const MovieDetails = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const movieId = Number(id);

    const { data: movie, loading, error } = useAppSelector((state) => state.movies.movieDetails);

    useEffect(() => {
        dispatch(fetchMovieDetails(movieId));
    }, [dispatch, movieId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !movie) {
        return <div>Error loading movie details</div>;
    }

    return (
        <div >
            <h2>{movie.title}</h2>
            <img
                src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image';
                }}
            />
            <p>{movie.overview}</p>
        </div>
    );
};