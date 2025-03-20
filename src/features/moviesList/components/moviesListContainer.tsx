import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {fetchPopularMovies, fetchTopRatedMovies} from '../../../store/slices/movieSlice';
import {Card, Col, Empty, Input, Layout, Modal, Pagination, Row, Tabs, Typography} from 'antd';
import {searchMovies} from '../../../store/slices/searchSlice';
import {MovieCard} from './MovieCard';
import {FireOutlined, UnorderedListOutlined} from '@ant-design/icons';
import {ListContainer} from '../../lists/components/ListContainer';
import {fetchUserLists} from "../../../store/slices/listSlice";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface Trailer {
    id: string;
    movieId: number;
    name: string;
    key: string;
    thumbnail: string;
    movieTitle: string;
}

interface HomeProps {}

export const MoviesListContainer: React.FC<HomeProps> = () => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('discover');
    const [currentTrailer, setCurrentTrailer] = useState<Trailer | null>(null);
    const [trailerModalVisible, setTrailerModalVisible] = useState<boolean>(false);
    const pageSize = 9; // 3x3 grid

    const searchResults = useAppSelector(state => state.search?.results || []);
    const isSearching = useAppSelector(state => state.search?.loading);
    const popularMovies = useAppSelector(state => state.movies?.popular?.results || []);
    const topRatedMovies = useAppSelector(state => state.movies?.topRated?.results || []);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const searchTotalResults = useAppSelector(state => state.search?.total_pages|| 0);
    const popularTotalResults = useAppSelector(state => state.movies.popular.total_pages || 0);
    const topRatedTotalResults = useAppSelector(state => state.movies.topRated.total_pages|| 0);
    // Handle tab changing through URL hash
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'lists') {
            setActiveTab('lists');
        }
    }, []);
    const { user, sessionId } = useAppSelector(state => state.auth);
    // Effect hook for initial data fetching
    useEffect(() => {
        dispatch(fetchPopularMovies(1));
        dispatch(fetchTopRatedMovies(1));
        console.log(user, sessionId);
        if (user && sessionId) {

            dispatch(fetchUserLists({ accountId: user.id, sessionId }));
        }
    }, [dispatch, user, sessionId]);

    // Event handler with proper typing
    const handleSearch = (value: string): void => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page on new search
        if (value.trim()) {
            dispatch(searchMovies({ query: value, page: 1 }));
        }
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
        window.scrollTo(0, 0);

        if (searchTerm) {
            dispatch(searchMovies({ query: searchTerm, page }));
        } else {
            dispatch(fetchPopularMovies(page));
        }
    };

    const handleTabChange = (activeKey: string): void => {
        setActiveTab(activeKey);
        setCurrentPage(1); // Reset pagination on tab change
        window.location.hash = activeKey === 'lists' ? 'lists' : '';
    };

    const closeTrailer = (): void => {
        setTrailerModalVisible(false);
        setCurrentTrailer(null);
    };

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
            return searchResults;
        }
        return popularMovies;
    };

   /* const getTotalCount = (state) => {
        if (searchTerm) {
            return searchTotalResults;
        }
        return popularTotalResults;
    };*/

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
                        {isAuthenticated && (
                            <TabPane
                                tab={
                                    <span style={{ color: 'white', fontSize: '16px' }}>
                                        <UnorderedListOutlined /> My Lists
                                    </span>
                                }
                                key="lists"
                            />
                        )}
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
                                                    total={searchTotalResults}
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
                                                    total={popularTotalResults}
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
                                                    total={topRatedTotalResults}
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

                {/* Lists Tab Content */}
                {activeTab === 'lists' && isAuthenticated && (
                    <ListContainer />
                )}

                {/* Trailer Modal */}
                <Modal
                    title={currentTrailer?.movieTitle}
                    open={trailerModalVisible}
                    onCancel={closeTrailer}
                    footer={null}
                    width="80%"
                    centered
                >
                    {currentTrailer && (
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                title={`${currentTrailer.movieTitle} - ${currentTrailer.name}`}
                                src={`https://www.youtube.com/embed/${currentTrailer.key}`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                allowFullScreen
                            />
                        </div>
                    )}
                </Modal>
            </Content>
        </Layout>
    );
};