import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Rate } from 'antd';
import { Movie } from '../../../types/movie.types';

interface MovieCardProps {
    movie?: Movie;  // Make it optional
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    if (!movie) {
        return (
            <Card loading style={{ height: '100%', width: '100%' }} />
        );
    }

    return (
        <Card
            hoverable
            style={{ height: '100%' }}
            cover={
                <img
                    alt={movie.title}
                    src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://critics.io/img/movies/poster-placeholder.png'
                    }
                    style={{
                        height: '300px',
                        objectFit: 'cover',
                        objectPosition: 'center top'
                    }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://critics.io/img/movies/poster-placeholder.png';
                    }}
                />
            }
        >
            <Link to={`/movie/${movie.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <Card.Meta
                    title={movie.title}
                    description={
                        <>
                            <div style={{ marginBottom: '8px' }}>
                                {movie.release_date && (
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                )}
                            </div>
                            {movie.vote_average && (
                                <Rate
                                    disabled
                                    allowHalf
                                    defaultValue={movie.vote_average / 2}
                                    style={{ fontSize: '16px' }}
                                />
                            )}
                        </>
                    }
                />
            </Link>
        </Card>
    );
};