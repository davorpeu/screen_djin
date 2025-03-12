// src/features/movieSearch/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export const selectMovies = (state: RootState) => state.movies.movies;

export const selectMovieById = createSelector(
    [selectMovies],
    (movies) => (movieId: number) =>
        movies.find((movie) => movie.id === movieId)
);