import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Rate} from 'antd';
import {Movie} from '@/types/movie';
import {IMAGE_BASE_URL, POSTER_SIZES} from '@/config';

interface MovieCardProps {
    movie?: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    if (!movie) {
        return (
            <Card loading style={{ height: '100%', width: '100%' }} />
        );
    }

    const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}/${POSTER_SIZES.medium}${movie.poster_path}`
        : 'https://critics.io/img/movies/poster-placeholder.png';

    return (
        <Link to={`/movie/${movie.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>

        <Card
            hoverable
            style={{ height: '100%' }}
            cover={
                <img
                    alt={movie.title}
                    src={posterUrl}
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
                <Card.Meta
                    title={movie.title}
                    description={
                        <>
                            <div style={{ marginBottom: '8px' }}>
                                {movie.release_date && (
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                )}
                            </div>
                            {movie.vote_average > 0 && (
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
        </Card>
        </Link>

    );
};