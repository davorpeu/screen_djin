import React, { useEffect } from 'react';
/*import { useSearch } from '/hooks';
import { SearchBar } from '@/components/ui/SearchBar';
import { MovieGrid } from '@/components/ui/MovieGrid';
import { Pagination } from '@/components/ui/Pagination';*/

export const SearchPage: React.FC = () => {
    const { results, totalPages, currentPage, searchTerm, changePage, search, status } = useSearch();

    useEffect(() => {
        if (searchTerm) {
            search();
        }
    }, [currentPage, searchTerm]);

    const isLoading = status === 'loading';
    const hasResults = results.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Search Movies and TV Shows</h1>

            <SearchBar />

            {searchTerm && !isLoading && !hasResults && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-400">No results found for "{searchTerm}"</p>
                </div>
            )}

            {searchTerm && (
                <MovieGrid movies={results} loading={isLoading} />
            )}

            {hasResults && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={changePage}
                />
            )}

            {!searchTerm && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-400">Start searching for movies and TV shows!</p>
                </div>
            )}
        </div>
    );
};