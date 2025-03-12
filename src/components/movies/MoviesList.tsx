// src/components/movies/MoviesList.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { selectMoviesByCategory } from '../../features/movieSearch/selectors';
import { MovieCard } from '../../components/MovieCard';

interface MoviesListProps {
    category: 'popular' | 'top_rated';
    title: string;
}

export const MoviesList: React.FC<MoviesListProps> = ({ category, title }) => {
    const movies = useAppSelector((state) =>
        selectMoviesByCategory(state, category)
    );

    if (!movies || !Array.isArray(movies)) {
        return (
            <div className="movies-list">
                <h2>{title}</h2>
                <div className="movies-grid">
                    {/* Loading state */}
                    {[...Array(8)].map((_, index) => (
                        <MovieCard key={`skeleton-${index}`} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="movies-list">
            <h2>{title}</h2>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};