import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { MoviesList } from '../../components/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from '../../store/slices/movieSlice';
import { Layout, Card, Typography, Input, Space, Empty } from 'antd';
import { searchMovies } from '../../store/slices/searchSlice';
import { MovieCard } from '../../components/MovieCard';

// Destructure Ant Design components with proper typing
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

// Define component props interface (empty since no props required)
interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
    // State management
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Selector hooks with proper typing
    const searchResults = useAppSelector(state => state.search?.results || []);
    const isSearching = useAppSelector(state => state.search?.loading);

    // Effect hook for initial data fetching
    useEffect(() => {
        dispatch(fetchPopularMovies());
        dispatch(fetchTopRatedMovies());
    }, [dispatch]);

    // Event handler with proper typing
    const handleSearch = (value: string): void => {
        setSearchTerm(value);
        if (value.trim()) {
            dispatch(searchMovies(value));
        }
    };

    return (
        <Layout className="home-page">
            {/* Hero Section */}
            <Header className="hero">
                <div className="hero__content" >
                    <Title level={1}>Discover Movies & TV Shows</Title>
                    <Text className="hero__description">
                        Find and track your favorite entertainment from around the world
                    </Text>

                    {/* Search Container */}
                    <div className="search-container" style={{
                        margin: '320px 160px 320px 160px',
                    }}>
                        <Search
                            placeholder="Search for movies..."
                            allowClear
                            enterButton
                            size="large"
                            onSearch={handleSearch}
                            loading={isSearching}
                            className="search-input"
                        />
                    </div>
                </div>
            </Header>

            <Content className="content-section">
                {searchTerm && (
                    <Card className="movies-list-card">
                        <div className="search-results">
                            <Title level={3}>Search Results for "{searchTerm}"</Title>

                            {searchResults.length > 0 ? (
                                <div className="movies-grid">
                                    {searchResults.map(movie => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            ) : (
                                <Empty description="No movies found" />
                            )}
                        </div>
                    </Card>
                )}

                {!searchTerm && (
                    <>
                        <Card className="movies-list-card">
                            <MoviesList
                                category="popular"
                                title="Popular Movies"

                            />
                        </Card>

                        <Card className="movies-list-card">
                            <MoviesList
                                category="top_rated"
                                title="Top Rated Movies"
                            />
                        </Card>
                    </>
                )}
            </Content>
        </Layout>
    );
};