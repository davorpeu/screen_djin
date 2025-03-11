// src/pages/Home/HomePage.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from 'hooks/useAppDispatch.ts';
import { MoviesList } from 'components/features/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from 'store/slices/moviesSlice';
import './HomePage.css';

export const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchPopularMovies());
        dispatch(fetchTopRatedMovies());
    }, [dispatch]);

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero__content">
                    <h1>Discover Movies & TV Shows</h1>
                    <p>Find and track your favorite entertainment from around the world</p>
                </div>
            </section>

            <div className="content-section">
                <MoviesList category="popular" title="Popular Movies" />
                <MoviesList category="top_rated" title="Top Rated Movies" />
            </div>
        </div>
    );
};

// src/pages/MovieDetails/MovieDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks/useAppDispatch.ts';
import { useAppSelector } from 'hooks/useAppSelector';
import { fetchMovieDetails } from 'store/slices/moviesSlice';
import { addToList } from 'store/slices/userListsSlice';
import { Cast, Video } from 'types/movie.types';
import './MovieDetailsPage.css';

export const MovieDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { data: movie, loading, error } = useAppSelector(state => state.movies.movieDetails);
    const userLists = useAppSelector(state => state.userLists.lists);

    useEffect(() => {
        if (id) {
            dispatch(fetchMovieDetails(Number(id)));