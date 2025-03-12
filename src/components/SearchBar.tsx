// components/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setSearchTerm, fetchMovies } from '../features/movieSearch/slice';
import { MovieAPI } from '../features/movieSearch/api';

interface SearchBarProps {
    apiKey?: string;
    baseUrl?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        apiKey = process.env.REACT_APP_TMDB_API_KEY || '',
                                                        baseUrl = 'https://api.themoviedb.org/3',
                                                    }) => {
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector((state) => state.movies.searchTerm);
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const movieApi = new MovieAPI({ apiKey, baseUrl });

    useEffect(() => {
        const timer = setTimeout(async () => {
            dispatch(setSearchTerm(localSearch));
            try {
                dispatch(setLoading(true));
                const movies = await movieApi.fetchMovies(localSearch);
                dispatch(setMovies(movies.results));
                dispatch(setTotalPages(movies.total_pages));
                dispatch(setError(null));
            } catch (error) {
                dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
            } finally {
                dispatch(setLoading(false));
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, dispatch, movieApi]);

    return (
        <div className="search-container">
            <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search movies, TV series..."
                aria-label="Search media"
            />
        </div>
    );
};