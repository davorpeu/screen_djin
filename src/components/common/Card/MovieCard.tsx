// src/components/ui/MovieCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie.types';
import { IMAGE_BASE_URL } from '@/config/config';
import { FaStar, FaPlus } from 'react-icons/fa';
import { useMovieLists } from '@/hooks';

interface MovieCardProps {
    movie: Movie;
    showAddToList?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, showAddToList = true }) => {
    const { lists, addMovie } = useMovieLists();
    const [showListOptions, setShowListOptions] = React.useState(false);

    const title = movie.title || movie.name || 'Unknown Title';
    const posterPath = movie.poster_path
        ? `${IMAGE_BASE_URL}/w342${movie.poster_path}`
        : '/placeholder-poster.jpg';
    const mediaType = movie.media_type || 'movie';
    const releaseDate = movie.release_date || movie.first_air_date;

    const handleAddToList = (listId: string) => {
        addMovie(listId, movie);
        setShowListOptions(false);
    };

    return (
        <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <Link to={`/${mediaType}/${movie.id}`}>
                <img src={posterPath} alt={title} className="w-full h-auto object-cover" />
                <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded-full flex items-center">
                    <FaStar className="mr-1" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                </div>
            </Link>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
                <p className="text-gray-400 text-sm">
                    {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
                </p>

                {showAddToList && (
                    <div className="relative mt-3">
                        <button
                            onClick={() => setShowListOptions(!showListOptions)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                        >
                            <FaPlus className="mr-1" /> Add to List
                        </button>

                        {showListOptions && lists.length > 0 && (
                            <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-md shadow-lg z-10 w-48">
                                {lists.map((list) => (
                                    <button
                                        key={list.id}
                                        onClick={() => handleAddToList(list.id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                                    >
                                        {list.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {showListOptions && lists.length === 0 && (
                            <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-md shadow-lg z-10 w-48 p-3">
                                <p className="text-sm text-white">No lists available. Create a list first.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// src/components/ui/Pagination.tsx
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Calculate range of pages to show
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range: number[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        // Add first page
        if (range[0] > 2) {
            range.unshift(-1); // -1 represents ellipsis
        }
        if (range[0] !== 1) {
            range.unshift(1);
        }

        // Add last page
        if (range[range.length - 1] < totalPages - 1) {
            range.push(-1); // -1 represents ellipsis
        }
        if (range[range.length - 1] !== totalPages) {
            range.push(totalPages);
        }

        return range;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-8 mb-8">
            <nav className="flex space-x-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                >
                    Previous
                </button>

                {getPageNumbers().map((page, index) => (
                    page === -1 ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-md ${
                                page === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                >
                    Next
                </button>
            </nav>
        </div>
    );
};
