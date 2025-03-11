// src/features/home/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useMovies } from '@/hooks';
import { MovieGrid } from '@/components/ui/MovieGrid';

export const HomePage: React.FC = () => {
    const { trending, status, getTrending } = useMovies();
    const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
    const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');

    useEffect(() => {
        getTrending(mediaType, timeWindow);
    }, [mediaType, timeWindow]);

    const isLoading = status === 'loading';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Trending</h1>

                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="mediaType" className="text-gray-300 text-sm font-medium">Type:</label>
                        <select
                            id="mediaType"
                            value={mediaType}
                            onChange={(e) => setMediaType(e.target.value as 'all' | 'movie' | 'tv')}
                            className="bg-gray-800 text-white rounded-md px-3 py-1 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label htmlFor="timeWindow" className="text-gray-300 text-sm font-medium">Time:</label>
                        <select
                            id="timeWindow"
                            value={timeWindow}
                            onChange={(e) => setTimeWindow(e.target.value as 'day' | 'week')}
                            className="bg-gray-800 text-white rounded-md px-3 py-1 text-sm"
                        >
                            <option value="day">Today</option>
                            <option value="week">This Week</option>
                        </select>
                    </div>
                </div>
            </div>

            <MovieGrid movies={trending} loading={isLoading} />
        </div>
    );
};

// src/features/search/SearchPage.tsx
import React, { useEffect } from 'react';
import { useSearch } from '@/hooks';
import { SearchBar } from '@/components/ui/SearchBar';
import { MovieGrid } from '@/components/ui/MovieGrid';
import { Pagination } from '@/components/ui/Pagination';

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

// src/features/details/DetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovies, useMovieLists } from '@/hooks';
import { IMAGE_BASE_URL } from '@/config/config';
import { FaStar, FaClock, FaCalendarAlt, FaPlus, FaLink } from 'react-icons/fa';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

export const DetailsPage: React.FC = () => {
    const { id, mediaType } = useParams<{ id: string; mediaType: string }>();
    const { selectedMovie, status, getMovieDetails } = useMovies();
    const { lists, addMovie } = useMovieLists();
    const [showListOptions, setShowListOptions] = useState(false);

    useEffect(() => {
        if (id && (mediaType === 'movie' || mediaType === 'tv')) {
            getMovieDetails(parseInt(id), mediaType);
        }
    }, [id, mediaType]);

    const isLoading = status === 'loading';

    if (isLoading || !selectedMovie) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
                    <div className="h-8 bg-gray-800 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
                    <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    const title = selectedMovie.title || selectedMovie.name || 'Unknown Title';
    const releaseDate = selectedMovie.release_date || selectedMovie.first_air_date;
    const backdropPath = selectedMovie.backdrop_path
        ? `${IMAGE_BASE_URL}/w1280${selectedMovie.backdrop_path}`
        : '/placeholder-backdrop.jpg';
    const posterPath = selectedMovie.poster_path
        ? `${IMAGE_BASE_URL}/w342${selectedMovie.poster_path}`
        : '/placeholder-poster.jpg';

    // Get trailer
    const trailer = selectedMovie.videos?.results.find(
        (video) => video.type.toLowerCase() === 'trailer' && video.site.toLowerCase() === 'youtube'
    ) || selectedMovie.videos?.results[0];

    const handleAddToList = (listId: string) => {
        if (selectedMovie) {
            const movieForList = {
                id: selectedMovie.id,
                title: selectedMovie.title || selectedMovie.name || '',
                poster_path: selectedMovie.poster_path,
                backdrop_path: selectedMovie.backdrop_path,
                overview: selectedMovie.overview,
                release_date: selectedMovie.release_date || selectedMovie.first_air_date,
                vote_average: selectedMovie.vote_average,
                vote_count: selectedMovie.vote_count,
                genre_ids: selectedMovie.genres.map(genre => genre.id),
                media_type: mediaType as 'movie' | 'tv',
            };

            addMovie(listId, movieForList);
            setShowListOptions(false);
        }
    };

    return (
        <div>
            {/* Backdrop Image */}
            <div
                className="h-80 md:h-96 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${backdropPath})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
                        <div className="flex flex-col md:flex-row items-start pb-8 w-full">
                            <img
                                src={posterPath}
                                alt={title}
                                className="hidden md:block w-48 rounded-lg shadow-lg"
                            />
                            <div className="md:ml-8 mt-4 md:mt-0">
                                <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
                                {releaseDate && (
                                    <div className="flex items-center text-gray-300 mt-2">
                                        <FaCalendarAlt className="mr-2" />
                                        {new Date(releaseDate).toLocaleDateString()}
                                    </div>
                                )}
                                <div className="flex items-center text-gray-300 mt-2">
                                    <FaStar className="text-yellow-500 mr-2" />
                                    {selectedMovie.vote_average.toFixed(1)}/10 ({selectedMovie.vote_count} votes)
                                </div>
                                {(selectedMovie.runtime || selectedMovie.episode_run_time) && (
                                    <div className="flex items-center text-gray-300 mt-2">
                                        <FaClock className="mr-2" />
                                        {selectedMovie.runtime
                                            ? `${selectedMovie.runtime} minutes`
                                            : `${selectedMovie.episode_run_time?.[0] || 'Unknown'} minutes per episode`
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Poster & Add to List (Mobile) */}
                    <div className="md:hidden">
                        <img
                            src={posterPath}
                            alt={title}
                            className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Main Content - Middle Column */}
                    <div className="md:col-span-2">
                        {selectedMovie.tagline && (
                            <p className="text-xl text-gray-400 italic mb-4">{selectedMovie.tagline}</p>
                        )}

                        <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                        <p className="text-gray-300 mb-6">{selectedMovie.overview}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedMovie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                                >
                  {genre.name}
                </span>
                            ))}
                        </div>

                        {selectedMovie.homepage && (
                            <a
                                href={selectedMovie.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-6"
                            >
                                <FaLink className="mr-2" /> Official Website
                            </a>
                        )}

                        {/* Trailer */}
                        {trailer && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
                                <VideoPlayer video={trailer} />
                            </div>
                        )}

                        {/* Cast */}
                        {selectedMovie.credits.cast.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Cast</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {selectedMovie.credits.cast.slice(0, 8).map((person) => (
                                        <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden">
                                            <img
                                                src={
                                                    person.profile_path
                                                        ? `${IMAGE_BASE_URL}/w185${person.profile_path}`
                                                        : '/placeholder-person.jpg'
                                                }
                                                alt={person.name}
                                                className="w-full h-40 object-cover object-center"
                                            />
                                            <div className="p-2">
                                                <p className="font-medium text-white truncate">{person.name}</p>
                                                <p className="text-sm text-gray-400 truncate">{person.character}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="hidden md:block">
                        <div className="sticky top-8">
                            <div className="bg-gray-800 rounded-lg p-4 mb-6">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowListOptions(!showListOptions)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                                    >
                                        <FaPlus className="mr-2" /> Add to My Lists
                                    </button>

                                    {showListOptions && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 rounded-md shadow-lg z-10">
                                            {lists.length > 0 ? (
                                                lists.map((list) => (
                                                    <button
                                                        key={list.id}
                                                        onClick={() => handleAddToList(list.id)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                                                    >
                                                        {list.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-sm text-gray-400">
                                                    No lists available. Create a list first.
                                                    <Link to="/lists" className="block mt-2 text-blue-500 hover:text-blue-400">
                                                        Go to My Lists
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional details */}
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="font-bold text-white mb-3">Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Status: </span>
                                        <span className="text-white">{selectedMovie.status}</span>
                                    </div>
                                    {selectedMovie.budget !== undefined && (
                                        <div>
                                            <span className="text-gray-400">Budget: </span>
                                            <span className="text-white">
                        {selectedMovie.budget > 0
                            ? `$${selectedMovie.budget.toLocaleString()}`
                            : 'N/A'}
                      </span>
                                        </div>
                                    )}
                                    {selectedMovie.revenue !== undefined && (
                                        <div>
                                            <span className="text-gray-400">Revenue: </span>
                                            <span className="text-white">
                        {selectedMovie.revenue > 0
                            ? `$${selectedMovie.revenue.toLocaleString()}`
                            : 'N/A'}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// src/features/lists/MyListsPage.tsx
import React, { useState } from 'react';
import { useMovieLists } from '@/hooks';
import { MovieCard } from '@/components/ui/MovieCard';
import { FaPlus, FaTrash, FaPen } from 'react-icons/fa';

export const MyListsPage: React.FC = () => {
    const { lists, create, remove, removeMovie, rename } = useMovieLists();
    const [newListName, setNewListName] = useState('');
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [editListName, setEditListName] = useState('');

    const handleCreateList = (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName.trim()) {
            create(newListName.trim());
            setNewListName('');
        }
    };

    const handleStartEdit = (listId: string, name: string) => {
        setEditingListId(listId);
        setEditListName(name);
    };

    const handleSaveEdit = (listId: string) => {
        if (editListName.trim()) {
            rename(listId, editListName.trim());
        }
        setEditingListId(null);
    };

    const handleCancelEdit = () => {
        setEditingListId(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">My Lists</h1>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Create New List</h2>
                <form onSubmit={handleCreateList} className="flex">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Enter list name"
                        className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md flex items-center"
                    >
                        <FaPlus className="mr-2" /> Create
                    </button>
                </form>
            </div>

            {lists.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <p className="text-xl text-gray-400">You haven't created any lists yet.</p>
                    <p className="text-gray-500 mt-2">Create your first list to start organizing your favorite movies and shows!</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {lists.map((list) => (
                        <div key={list.id} className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                {editingListId === list.id ? (
                                    <div className="flex-grow flex items-center">
                                        <input
                                            type="text"
                                            value={editListName}
                                            onChange={(e) => setEditListName(e.target.value)}
                                            className="flex-grow px-3 py-1 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(list.id)}
                                            className="ml-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="ml-2 bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{list.name}</h2>
                                            <p className="text-gray-400 text-sm">
                                                {list.movies.length} {list.movies.length === 1 ? 'item' : 'items'} •
                                                Created {new Date(list.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStartEdit(list.id, list.name)}
                                                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md"
                                                title="Rename list"
                                            >
                                                <FaPen />
                                            </button>
                                            <button
                                                onClick={() => remove(list.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                                                title="Delete list"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6">
                                {list.movies.length === 0 ? (
                                    <p className="text-gray-400 text-center py-6">
                                        This list is empty. Add movies or TV shows while browsing.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                        {list.movies.map((movie) => (
                                            <div key={movie.id} className="relative">
                                                <MovieCard movie={movie} showAddToList={false} />
                                                <button
                                                    onClick={() => removeMovie(list.id, movie.id)}
                                                    className="absolute top-2 left-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                                                    title="Remove from list"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};