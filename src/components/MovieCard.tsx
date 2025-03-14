import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie.types';

interface MovieCardProps {
    movie?: Movie;  // Make it optional
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    if (!movie) {
        return <div className="movie-card skeleton">
            {/* Skeleton UI */}
        </div>;
    }

    return (
        <div className="movie-card">
            <Link to={`/movie/${movie.id}`}>
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
                <h3>{movie.title}</h3>
            </Link>
        </div>
    );
};