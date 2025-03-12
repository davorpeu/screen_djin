// src/components/MovieCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    return (
        <div className="movie-card">
            <Link to={`/movie/${movie.id}`}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <h3>{movie.title}</h3>
            </Link>
        </div>
    );
};