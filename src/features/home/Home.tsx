import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { MoviesList } from '../../components/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from '../../store/slices/movieSlice';
import { Layout, Card, Typography, Input, Empty, Row, Col, Pagination, Tabs, Button, Modal } from 'antd';
import { searchMovies } from '../../store/slices/searchSlice';
import { MovieCard } from '../../components/MovieCard';
import { PlayCircleOutlined, UnorderedListOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
interface MovieList {
    id: string;
    name: string;
    description: string;
    movies: number[];
    created: string;
}
interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('discover');
    const [currentTrailer, setCurrentTrailer] = useState<Trailer | null>(null);
    const [trailerModalVisible, setTrailerModalVisible] = useState<boolean>(false);
    const pageSize = 9; // 3x3 grid
    const [lists, setLists] = useState<MovieList[]>([

    ]);
    const [newListName, setNewListName] = useState<string>('');
    const [newListDescription, setNewListDescription] = useState<string>('');
    const [createListModalVisible, setCreateListModalVisible] = useState<boolean>(false);
    const searchResults = useAppSelector(state => state.search?.results || []);
    const isSearching = useAppSelector(state => state.search?.loading);
    const popularMovies = useAppSelector(state => state.movies?.popular?.results || []);
    const topRatedMovies = useAppSelector(state => state.movies?.topRated?.results || []);

    const mockTrailers: Trailer[] = [

    ];

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
    const showCreateListModal = () => {
        setCreateListModalVisible(true);
    };

    const handleCreateList = () => {
        if (newListName.trim()) {
            const newList: MovieList = {
                id: Date.now().toString(),
                name: newListName,
                description: newListDescription,
                movies: [],
                created: new Date().toISOString().split('T')[0]
            };
            setLists([...lists, newList]);
            setNewListName('');
            setNewListDescription('');
            setCreateListModalVisible(false);
        }
    };

    const handleDeleteList = (listId: string) => {
        setLists(lists.filter(list => list.id !== listId));
    };
    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    const handleTabChange = (activeKey: string): void => {
        setActiveTab(activeKey);
        setCurrentPage(1); // Reset pagination on tab change
    };

    const openTrailer = (trailer: Trailer): void => {
        setCurrentTrailer(trailer);
        setTrailerModalVisible(true);
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
            return getPaginatedData(searchResults);
        }
        // Default to popular movies when not searching
        return getPaginatedData(popularMovies);
    };

    const getTotalCount = () => {
        if (searchTerm && Array.isArray(searchResults)) {
            return searchResults.length;
        }
        return Array.isArray(popularMovies) ? popularMovies.length : 0;
    };

    const getPaginatedTrailers = () => {
        return getPaginatedData(mockTrailers);
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
                        <Title level={3} style={{ marginBottom: '24px' }}>Latest Movie Trailers</Title>
                        <Row gutter={[24, 24]}>
                            {getPaginatedTrailers().map(trailer => (
                                <Col xs={24} sm={12} md={8} key={trailer.id}>
                                    <Card
                                        hoverable
                                        cover={
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    alt={`${trailer.movieTitle} trailer`}
                                                    src={trailer.thumbnail}
                                                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                                />
                                                <PlayCircleOutlined
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        fontSize: '48px',
                                                        color: 'white',
                                                        opacity: 0.8,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => openTrailer(trailer)}
                                                />
                                            </div>
                                        }
                                        onClick={() => openTrailer(trailer)}
                                    >
                                        <Card.Meta
                                            title={trailer.movieTitle}
                                            description={trailer.name}
                                        />
                                    </Card>
                                </Col>
                                ))}
                        </Row>
                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={mockTrailers.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    </Card>
                    )}

                {/* Lists Tab Content */}
                {activeTab === 'lists' && (
                    <div>
                        <Card style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <Title level={3} style={{ margin: 0 }}>My Movie Lists</Title>
                                <Button type="primary" icon={<PlusOutlined />} onClick={showCreateListModal}>
                                    Create List
                                </Button>
                            </div>

                            {lists.length > 0 ? (
                                <Row gutter={[24, 24]}>
                                    {lists.map(list => (
                                        <Col xs={24} sm={12} md={8} key={list.id}>
                                            <Card
                                                hoverable
                                                actions={[
                                                    <EditOutlined key="edit"  onClick={() => handleDeleteList(list.id)}/>,
                                                    <DeleteOutlined key="delete" onClick={() => handleDeleteList(list.id)} />
                                                ]}
                                            >
                                                <Card.Meta
                                                    title={list.name}
                                                    description={
                                                        <>
                                                            <p>{list.description}</p>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Text type="secondary">{list.movies.length} movies</Text>
                                                                <Text type="secondary">Created: {list.created}</Text>
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Empty
                                    description="You haven't created any lists yet"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                >
                                    <Button type="primary" onClick={showCreateListModal}>Create Your First List</Button>
                                </Empty>
                            )}
                        </Card>

                        {/* Create List Modal */}
                        <Modal
                            title="Create New List"
                            open={createListModalVisible}
                            onOk={handleCreateList}
                            onCancel={() => setCreateListModalVisible(false)}
                            okButtonProps={{ disabled: !newListName.trim() }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    placeholder="List Name"
                                    value={newListName}
                                    onChange={e => setNewListName(e.target.value)}
                                    maxLength={50}
                                />
                            </div>
                            <div>
                                <Input.TextArea
                                    placeholder="Description (optional)"
                                    value={newListDescription}
                                    onChange={e => setNewListDescription(e.target.value)}
                                    maxLength={200}
                                    rows={4}
                                />
                            </div>
                        </Modal>
                    </div>
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