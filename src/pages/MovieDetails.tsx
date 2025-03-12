// src/pages/MovieDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { selectMovieById } from '../features/movieSearch/selectors';

export const MovieDetails = () => {
    const { id } = useParams();
    const movie = useAppSelector((state) => selectMovieById(state, Number(id)));

    if (!movie) {
        return <div>Movie not found</div>;
    }

    return (
        <div className="movie-details">
            <h2>{movie.title}</h2>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <p>{movie.overview}</p>
        </div>
    );
};