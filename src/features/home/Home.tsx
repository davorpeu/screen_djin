import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MoviesList } from '../../components/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from '../../store/slices/movieSlice';
import { Layout, Card, Typography, Input, Empty } from 'antd';
import { searchMovies } from '../../store/slices/searchSlice';
import { MovieCard } from '../../components/MovieCard';
import { Col, Row } from 'antd';
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
        <Layout >
            {/* Hero Section */}
            <Header >
                <div  >
                    <Title level={1}  style={{
                        textAlign: 'left',
                        fontSize: '18px',
                        color: '#1A91DA',
                        marginBottom: '16px'
                    }}>Discover Movies & TV Shows</Title>
                    <Text >
                        Find and track your favorite entertainment from around the world
                    </Text>

                    {/* Search Container */}
                    <div  style={{
                        margin: '320px 160px 320px 160px',
                    }}>
                        <Search
                            placeholder="Search for movies..."
                            allowClear
                            enterButton
                            size="large"
                            onSearch={handleSearch}
                            loading={isSearching}
                            
                        />
                    </div>
                </div>
            </Header>

            <Content >
                {searchTerm && (
                    <Card >
                        <div >
                            <Title level={3}>Search Results for "{searchTerm}"</Title>
                            <Row>
                                <Col span={8}>col-8</Col>
                                <Col span={8}>col-8</Col>
                                <Col span={8}>col-8</Col>
                            </Row>
                            {searchResults.length > 0 ? (
                                <div >
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
                      {/*  <Card >
                            <MoviesList
                                category="popular"
                                title="Popular Movies"

                            />
                        </Card>*/}

                        <Card >
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