import React from 'react';
import {Card, Col, Empty, Input, Layout, Modal, Pagination, Row, Tabs, Typography} from 'antd';
import {FireOutlined, UnorderedListOutlined} from '@ant-design/icons';
import {MovieCard} from '@/components/ui/MovieCard';
import {ListsContainer} from '@/features/lists';
import {Movie} from '@/types/movie';

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

interface MoviesListProps {
    popularMovies: Movie[];
    topRatedMovies: Movie[];
    searchResults: Movie[];
    currentPage: number;
    searchTerm: string;
    activeTab: string;
    isSearching: boolean;
    currentTrailer: Trailer | null;
    trailerModalVisible: boolean;
    isAuthenticated: boolean;

    popularMoviesPages: number;
    topRatedMoviesPages: number;
    searchResultsPages: number;
    pageSize: number;

    onSearch: (value: string) => void;
    onPageChange: (page: number) => void;
    onTabChange: (activeKey: string) => void;
    onCloseTrailer: () => void;
}

export const MoviesList: React.FC<MoviesListProps> = ({
                                                          popularMovies,
                                                          topRatedMovies,
                                                          searchResults,
                                                          currentPage,
                                                          searchTerm,
                                                          activeTab,
                                                          isSearching,
                                                          currentTrailer,
                                                          trailerModalVisible,
                                                          isAuthenticated,
                                                          popularMoviesPages,
                                                          topRatedMoviesPages,
                                                          searchResultsPages,
                                                          pageSize,
                                                          onSearch,
                                                          onPageChange,
                                                          onTabChange,
                                                          onCloseTrailer
                                                      }) => {
    const getCurrentData = (): Movie[] => {
        if (searchTerm) {
            return searchResults;
        }
        return popularMovies;
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
                            onSearch={onSearch}
                            loading={isSearching}
                        />
                    </div>

                    <Tabs
                        activeKey={activeTab}
                        onChange={onTabChange}
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

                                    {searchResults.length > 0 ? (
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
                                                    total={searchResultsPages * pageSize}
                                                    onChange={onPageChange}
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
                                    {popularMovies.length > 0 ? (
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
                                                    total={popularMoviesPages * pageSize}
                                                    onChange={onPageChange}
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
                                    {topRatedMovies.length > 0 ? (
                                        <>
                                            <Row gutter={[24, 24]}>
                                                {topRatedMovies.map(movie => (
                                                    <Col xs={24} sm={12} md={8} key={movie.id}>
                                                        <MovieCard movie={movie} />
                                                    </Col>
                                                ))}
                                            </Row>
                                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                                <Pagination
                                                    current={currentPage}
                                                    pageSize={pageSize}
                                                    total={topRatedMoviesPages * pageSize}
                                                    onChange={onPageChange}
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
                    <ListsContainer />
                )}

                {/* Trailer Modal */}
                <Modal
                    title={currentTrailer?.movieTitle}
                    open={trailerModalVisible}
                    onCancel={onCloseTrailer}
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