import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { searchContent } from '../store/slices/searchSlice';
import { useAppSelector } from '../store/hooks';

interface SearchBarProps {
    apiKey?: string;
    baseUrl?: string;
}

export const SearchBar: React.FC<SearchBarProps> = () => {
    const dispatch = useDispatch();
    const { query, loading } = useAppSelector((state) => state.search);
    const [localSearch, setLocalSearch] = useState(query || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch && localSearch.trim().length > 0) {
                dispatch(searchContent({ query: localSearch }) as any);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, dispatch]);

    return (
        <div >
            <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search movies, TV series..."
                aria-label="Search media"
                disabled={loading}
            />
            {loading && <span >Searching...</span>}
        </div>
    );
};