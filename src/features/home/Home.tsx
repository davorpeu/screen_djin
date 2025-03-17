import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { MoviesList } from '../../components/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from '../../store/slices/movieSlice';
import { Layout, Card, Typography, Input, Empty, Row, Col, Pagination, Tabs, Button } from 'antd';
import { searchMovies } from '../../store/slices/searchSlice';
import { MovieCard } from '../../components/MovieCard';
import { PlayCircleOutlined, UnorderedListOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';

// Destructure Ant Design components with proper typing
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

// Define component props interface (empty since no props required)
interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
    // State management
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('discover');
    const pageSize = 9; // 3x3 grid

    // Selector hooks with proper typing
    const searchResults = useAppSelector(state => state.search?.results || []);
    const isSearching = useAppSelector(state => state.search?.loading);
    const popularMovies = useAppSelector(state => state.movies?.popular?.results || []);
    const topRatedMovies = useAppSelector(state => state.movies?.topRated?.results || []);

    // Effect hook for initial data fetching
    useEffect(() => {
        dispatch(fetchPopularMovies());
        dispatch(fetchTopRatedMovies());
    }, [dispatch]);

    // Event handler with proper typing
    const handleSearch = (value: string): void => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page on new search
        if (value.trim()) {
            dispatch(searchMovies(value));
        }
    };

    // Pagination handler
    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    // Tab change handler
    const handleTabChange = (activeKey: string): void => {
        setActiveTab(activeKey);
        setCurrentPage(1); // Reset pagination on tab change
    };

    // Calculate pagination slices for current view
    const getPaginatedData = (data: any[]) => {
        if (!Array.isArray(data)) {
            return [];
        }
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    };

    // Get current data based on search or category
    const getCurrentData = () => {
        if (searchTerm && Array.isArray(searchResults)) {
            return getPaginatedData(searchResults);
        }
        // Default to popular movies when not searching
        return getPaginatedData(popularMovies);
    };

    // Get total count for pagination
    const getTotalCount = () => {
        if (searchTerm && Array.isArray(searchResults)) {
            return searchResults.length;
        }
        return Array.isArray(popularMovies) ? popularMovies.length : 0;
    };

    return (
        <Layout>
            {/* Hero Section */}
            <Header style={{
                height: 'auto',
                padding: '40px 0 20px',
                textAlign: 'center',
                background: 'linear-gradient(to right, #192f6a, #4c9aff)'
            }}>
                <div>
                    <Title level={1} style={{ color: 'white', margin: '0 0 16px 0' }}>
                        Discover Movies & TV Shows
                    </Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', display: 'block', marginBottom: '24px' }}>
                        Find and track your favorite entertainment from around the world
                    </Text>

                    {/* Search Container - Centered */}
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto 24px',
                        padding: '0 16px'
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

                    {/* Navigation Tabs */}
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        centered
                        style={{
                            marginTop: '16px',
                            color: 'white'
                        }}
                    >
                        <TabPane
                            tab={
                                <span style={{ color: 'white', fontSize: '16px' }}>
                                    <FireOutlined /> Discover
                                </span>
                            }
                            key="discover"
                        />
                        <TabPane
                            tab={
                                <span style={{ color: 'white', fontSize: '16px' }}>
                                    <PlayCircleOutlined /> Trailers
                                </span>
                            }
                            key="trailers"
                        />
                        <TabPane
                            tab={
                                <span style={{ color: 'white', fontSize: '16px' }}>
                                    <UnorderedListOutlined /> My Lists
                                </span>
                            }
                            key="lists"
                        />
                    </Tabs>
                </div>
            </Header>

            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Discover Tab Content */}
                {activeTab === 'discover' && (
                    <>
                        {searchTerm && (
                            <Card style={{ marginBottom: '24px' }}>
                                <div>
                                    <Title level={3} style={{ marginBottom: '24px' }}>
                                        Search Results for "{searchTerm}"
                                    </Title>

                                    {Array.isArray(searchResults) && searchResults.length > 0 ? (
                                        <>
                                            <Row gutter={[24, 24]}>
                                                {getCurrentData().map(movie => (
                                                    <Col xs={24} sm={12} md={8} key={movie.id}>
                                                        <MovieCard movie={movie} />
                                                    </Col>
                                                ))}
                                            </Row>
                                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                                <Pagination
                                                    current={currentPage}
                                                    pageSize={pageSize}
                                                    total={getTotalCount()}
                                                    onChange={handlePageChange}
                                                    showSizeChanger={false}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <Empty description="No movies found" />
                                    )}
                                </div>
                            </Card>
                        )}

                        {!searchTerm && (
                            <>
                                <Card style={{ marginBottom: '24px' }}>
                                    <Title level={3} style={{ marginBottom: '24px' }}>
                                        Popular Movies
                                    </Title>
                                    {Array.isArray(popularMovies) && popularMovies.length > 0 ? (
                                        <>
                                            <Row gutter={[24, 24]}>
                                                {getCurrentData().map(movie => (
                                                    <Col xs={24} sm={12} md={8} key={movie.id}>
                                                        <MovieCard movie={movie} />
                                                    </Col>
                                                ))}
                                            </Row>
                                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                                <Pagination
                                                    current={currentPage}
                                                    pageSize={pageSize}
                                                    total={getTotalCount()}
                                                    onChange={handlePageChange}
                                                    showSizeChanger={false}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <Empty description="Loading movies..." />
                                    )}
                                </Card>

                                <Card>
                                    <Title level={3} style={{ marginBottom: '24px' }}>
                                        Top Rated Movies
                                    </Title>
                                    {Array.isArray(topRatedMovies) && topRatedMovies.length > 0 ? (
                                        <>
                                            <Row gutter={[24, 24]}>
                                                {getPaginatedData(topRatedMovies).map(movie => (
                                                    <Col xs={24} sm={12} md={8} key={movie.id}>
                                                        <MovieCard movie={movie} />
                                                    </Col>
                                                ))}
                                            </Row>
                                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                                <Pagination
                                                    current={currentPage}
                                                    pageSize={pageSize}
                                                    total={Array.isArray(topRatedMovies) ? topRatedMovies.length : 0}
                                                    onChange={handlePageChange}
                                                    showSizeChanger={false}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <Empty description="Loading movies..." />
                                    )}
                                </Card>
                            </>
                        )}
                    </>
                )}

                {/* Trailers Tab Content */}
                {activeTab === 'trailers' && (
                    <Card>
                        <Title level={3}>Movie Trailers</Title>
                        <Empty
                            description="Trailers Coming Soon"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button type="primary">Browse Movies</Button>
                        </Empty>
                    </Card>
                )}

                {/* Lists Tab Content */}
                {activeTab === 'lists' && (
                    <Card>
                        <Title level={3}>My Movie Lists</Title>
                        <Empty
                            description="Create your first movie list"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button type="primary">Create List</Button>
                        </Empty>
                    </Card>
                )}
            </Content>
        </Layout>
    );
};