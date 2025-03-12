// components/FilterPanel.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setCurrentPage, setMovies, setLoading, setError } from '../features/movieSearch/slice';
import { MovieAPI } from '../features/movieSearch/api';

interface FilterPanelProps {
    apiKey?: string;
    baseUrl?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
                                                            apiKey = process.env.REACT_APP_TMDB_API_KEY || '',
                                                            baseUrl = 'https://api.themoviedb.org/3',
                                                        }) => {
    const dispatch = useAppDispatch();
    const currentPage = useAppSelector((state) => state.movies.currentPage);
    const searchTerm = useAppSelector((state) => state.movies.searchTerm);
    const movieApi = new MovieAPI({ apiKey, baseUrl });

    const handleSortChange = async (sortOption: string) => {
        try {
            dispatch(setLoading(true));
            const movies = await movieApi.fetchMovies(searchTerm, 1);
            dispatch(setMovies(movies.results));
            dispatch(setCurrentPage(1));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="filter-panel">
            <select
                aria-label="Sort movies"
                onChange={(e) => handleSortChange(e.target.value)}
            >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest First</option>
            </select>

            <button
                onClick={() => dispatch(setCurrentPage(1))}
                aria-label="Reset filters"
            >
                Reset Filters
            </button>
        </div>
    );
};