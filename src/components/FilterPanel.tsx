import React from 'react';
import { useDispatch } from 'react-redux';
import { updateFilters } from '../store/slices/SearchSlicer';
import { useAppSelector } from '../store/hooks';

export const FilterPanel: React.FC = () => {
    const dispatch = useDispatch();
    const filters = useAppSelector((state) => state.search.filters);

    const handleTypeChange = (type: 'all' | 'movie' | 'tv' | 'person') => {
        dispatch(updateFilters({ type }));
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const genreId = e.target.value ? parseInt(e.target.value) : null;
        dispatch(updateFilters({ genre: genreId }));
    };

    return (
        <div className="filter-panel">
            <div className="filter-type">
                <button
                    className={filters.type === 'all' ? 'active' : ''}
                    onClick={() => handleTypeChange('all')}
                >
                    All
                </button>
                <button
                    className={filters.type === 'movie' ? 'active' : ''}
                    onClick={() => handleTypeChange('movie')}
                >
                    Movies
                </button>
                <button
                    className={filters.type === 'tv' ? 'active' : ''}
                    onClick={() => handleTypeChange('tv')}
                >
                    TV Shows
                </button>
                <button
                    className={filters.type === 'person' ? 'active' : ''}
                    onClick={() => handleTypeChange('person')}
                >
                    People
                </button>
            </div>

            <select
                value={filters.genre?.toString() || ''}
                onChange={handleGenreChange}
                aria-label="Filter by genre"
            >
                <option value="">All Genres</option>
                <option value="28">Action</option>
                <option value="12">Adventure</option>
                <option value="16">Animation</option>
                <option value="35">Comedy</option>
                <option value="80">Crime</option>
                <option value="99">Documentary</option>
                <option value="18">Drama</option>
                <option value="10751">Family</option>
                <option value="14">Fantasy</option>
                <option value="36">History</option>
                <option value="27">Horror</option>
                <option value="10402">Music</option>
                <option value="9648">Mystery</option>
                <option value="10749">Romance</option>
                <option value="878">Science Fiction</option>
                <option value="10770">TV Movie</option>
                <option value="53">Thriller</option>
                <option value="10752">War</option>
                <option value="37">Western</option>
            </select>
        </div>
    );
};