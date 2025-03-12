// src/features/movieSearch/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

// Selector to find a movie by ID across all categories
export const selectMovieById = createSelector(
    [(state: RootState) => state.movies],
    (moviesState) => (movieId: number) => {
        // Search across all categories
        const allMovies = [
            ...moviesState.popular.results,
            ...moviesState.topRated.results,
            ...Object.values(moviesState.byGenre).flatMap(genre => genre.results)
        ];
        return allMovies.find(movie => movie.id === movieId);
    }
);

// Selector to get movies by category
export const selectMoviesByCategory = createSelector(
    [(state: RootState) => state.movies],
    (moviesState) => (category: string) => {
        switch (category) {
            case 'popular':
                return moviesState.popular.results;
            case 'top_rated':
                return moviesState.topRated.results;
            default:
                return [];
        }
    }
);