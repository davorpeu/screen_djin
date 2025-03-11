// src/components/ui/SearchBar.tsx (continued)
id="include_adult"
name="include_adult"
checked={localFilters.include_adult}
onChange={handleFilterChange}
className="mr-2 bg-gray-700 text-blue-500 rounded"
    />
    <label htmlFor="include_adult" className="text-sm font-medium text-gray-300">
    Include adult content
</label>
</div>
</div>

<div className="mt-4 flex justify-end space-x-3">
    <button
        type="button"
        onClick={resetLocalFilters}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
    >
        Reset
    </button>
    <button
        type="button"
        onClick={applyLocalFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
        Apply Filters
    </button>
</div>
</div>
)}
</div>
);
};

// src/components/ui/MovieGrid.tsx
import React from 'react';
import { Movie } from '@/types/movie.types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
    movies: Movie[];
    loading?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, loading = false }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-64 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-400">No movies found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

// src/components/ui/VideoPlayer.tsx
import React from 'react';
import { Video } from '@/types/movie.types';

interface VideoPlayerProps {
    video: Video;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
    if (video.site.toLowerCase() !== 'youtube') {
        return <p className="text-gray-400">Unsupported video source</p>;
    }

    return (
        <div className="aspect-w-16 aspect-h-9">
            <iframe
                title={video.name}
                src={`https://www.youtube.com/embed/${video.key}`}
                allowFullScreen
                className="w-full h-full rounded-md"
            ></iframe>
        </div>
    );
};

// src/components/layout/Header.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaFilm, FaHome, FaSearch, FaListUl } from 'react-icons/fa';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <FaFilm className="text-blue-500 text-2xl mr-2" />
                            <span className="font-bold text-white text-xl">MovieHub</span>
                        </Link>
                    </div>

                    <nav className="flex items-center space-x-4">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <FaHome className="mr-1" /> Home
                        </NavLink>
                        <NavLink
                            to="/search"
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <FaSearch className="mr-1" /> Search
                        </NavLink>
                        <NavLink
                            to="/lists"
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <FaListUl className="mr-1" /> My Lists
                        </NavLink>
                    </nav>
                </div>
            </div>
        </header>
    );
};

// src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                    <div className="mt-2">
                        <img
                            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                            alt="TMDB Logo"
                            className="h-6 mx-auto"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};