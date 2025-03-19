// src/components/movies/MoviesList.tsx
import React from 'react';
import { useAppSelector } from '../../../hooks';
import { selectMoviesByCategory } from '../../movieSearch/selectors';
import { MovieCard } from './MovieCard';

interface MoviesListProps {
    category: 'popular' | 'top_rated';
    title: string;
}

export const MoviesList: React.FC<MoviesListProps> = ({ category, title }) => {
    const movies = useAppSelector((state) =>
        selectMoviesByCategory(state, category)
    );

    const loading = useAppSelector((state) =>
        category === 'popular' ? state.movies.popular.loading : state.movies.topRated.loading
    );

    if (loading || !movies || !Array.isArray(movies)) {
        return (
            <div  >
                <h2>{title}</h2>
                <div >
                    {/* Loading state - create empty placeholder objects for the skeleton */}
                    {[...Array(8)].map((_, index) => (
                        <MovieCard
                            key={`skeleton-${index}`}
                            movie={{
                                id: `skeleton-${index}`,
                                title: 'Loading...',
                                poster_path: '',
                                // Add other required Movie properties with default values
                            } as any}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div >
            <h2>{title}</h2>
            <div >
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};