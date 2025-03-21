import React, {useEffect, useState} from 'react';
import {useMovies} from '@/features/movies';
import {useAuth} from '@/features/auth';
import {MoviesList} from './MoviesList';
import {Movie} from '@/types/movie';

interface Trailer {
    id: string;
    movieId: number;
    name: string;
    key: string;
    thumbnail: string;
    movieTitle: string;
}

export const MoviesListContainer: React.FC = () => {
    const { movies, search, getPopularMovies, getTopRatedMovies, searchForMovies } = useMovies();
    const { isAuthenticated } = useAuth();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('discover');
    const [currentTrailer, setCurrentTrailer] = useState<Trailer | null>(null);
    const [trailerModalVisible, setTrailerModalVisible] = useState<boolean>(false);
    const pageSize = 9; //

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'lists') {
            setActiveTab('lists');
        }
    }, []);

    useEffect(() => {
        getPopularMovies(1);
        getTopRatedMovies(1);
    }, [getPopularMovies, getTopRatedMovies]);

    const handleSearch = (value: string): void => {
        handleTabChange('discover');
        setSearchTerm(value);
        setCurrentPage(1);
        if (value.trim()) {
            searchForMovies(value, 1);
        }
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
        window.scrollTo(0, 0);

        if (searchTerm) {
            searchForMovies(searchTerm, page);
        } else {
            getPopularMovies(page);
        }
    };

    const handleTabChange = (activeKey: string): void => {
        setActiveTab(activeKey);
        setCurrentPage(1);
        window.location.hash = activeKey === 'lists' ? 'lists' : '';
    };

    const handleCloseTrailer = (): void => {
        setTrailerModalVisible(false);
        setCurrentTrailer(null);
    };

    const getPaginatedTopRatedMovies = (): Movie[] => {
        const results = movies.topRated.results || [];
        if (!Array.isArray(results)) {
            return [];
        }
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return results.slice(startIndex, endIndex);
    };

    const popularMovies = movies.popular?.results || [];

    const topRatedMovies = getPaginatedTopRatedMovies();

    const searchResults = search?.results || [];

    const popularMoviesPages = movies.popular?.total_pages || 1;
    const topRatedMoviesPages = movies.topRated?.total_pages || 1;
    const searchResultsPages = search?.total_pages || 1;

    const isSearching = search?.loading || false;

    return (
        <MoviesList
            popularMovies={popularMovies}
            topRatedMovies={topRatedMovies}
            searchResults={searchResults}
            currentPage={currentPage}
            searchTerm={searchTerm}
            activeTab={activeTab}
            isSearching={isSearching}
            currentTrailer={currentTrailer}
            trailerModalVisible={trailerModalVisible}
            isAuthenticated={isAuthenticated}
            popularMoviesPages={popularMoviesPages}
            topRatedMoviesPages={topRatedMoviesPages}
            searchResultsPages={searchResultsPages}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onTabChange={handleTabChange}
            onCloseTrailer={handleCloseTrailer}
        />
    );
};