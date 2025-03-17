import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie.types';
import { Button, Popover, Space } from 'antd';

interface MovieCardProps {
    movie?: Movie;  // Make it optional
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    if (!movie) {
        return <div >
            {/* Skeleton UI */}
        </div>;
    }

    return (
        <div >
            <Link to={`/movie/${movie.id}`}  >
                <img
                    src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={movie.title}
                    title={movie.title}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                />
            </Link>
        </div>
    );
};