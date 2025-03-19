import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { fetchMovieDetails, fetchMovieTrailers } from '../../../store/slices/movieSlice';
import { Layout, Card, Typography, Spin, Row, Col, Tag, Rate, Divider, Tabs, Empty, Modal } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export const MovieDetails = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const movieId = Number(id);
    const [currentTrailer, setCurrentTrailer] = useState<any>(null);
    const [trailerModalVisible, setTrailerModalVisible] = useState<boolean>(false);

    const {
        data: movie,
        loading,
        error,
        trailers,
        trailersLoading,
        trailersError
    } = useAppSelector((state) => state.movies.movieDetails);

    useEffect(() => {
        dispatch(fetchMovieDetails(movieId));
        dispatch(fetchMovieTrailers(movieId));
    }, [dispatch, movieId]);

    // Function to get YouTube trailers only
    const getYouTubeTrailers = () => {
        if (!trailers || !Array.isArray(trailers)) return [];
        return trailers.filter(
            trailer =>
                trailer.site.toLowerCase() === 'youtube' &&
                (trailer.type.toLowerCase() === 'trailer' || trailer.type.toLowerCase() === 'teaser')
        );
    };

    const openTrailer = (trailer: any): void => {
        setCurrentTrailer(trailer);
        setTrailerModalVisible(true);
    };

    const closeTrailer = (): void => {
        setTrailerModalVisible(false);
        setCurrentTrailer(null);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Loading movie details..." />
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div style={{ textAlign: 'center', padding: '48px' }}>
                <Empty
                    description="Error loading movie details"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    const youtubeTrailers = getYouTubeTrailers();

    return (
        <Layout>
            {/* Movie Header/Hero Section */}
            <Header style={{
                height: 'auto',
                padding: '40px 0 20px',
                background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} sm={24} md={8} lg={6}>
                            <img
                                src={movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : 'https://via.placeholder.com/500x750?text=No+Image'
                                }
                                alt={movie.title}
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image';
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={16} lg={18}>
                            <Title level={1} style={{ color: 'white', margin: '0 0 8px 0' }}>
                                {movie.title}
                            </Title>
                            {movie.tagline && (
                                <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '18px', display: 'block', marginBottom: '16px', fontStyle: 'italic' }}>
                                    {movie.tagline}
                                </Text>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                {movie.genres && movie.genres.map(genre => (
                                    <Tag key={genre.id} color="blue">{genre.name}</Tag>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '16px' }}>
                                {movie.release_date && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarOutlined style={{ color: 'white', marginRight: '8px' }} />
                                        <Text style={{ color: 'white' }}>{new Date(movie.release_date).toLocaleDateString()}</Text>
                                    </div>
                                )}
                                {movie.runtime && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <ClockCircleOutlined style={{ color: 'white', marginRight: '8px' }} />
                                        <Text style={{ color: 'white' }}>{movie.runtime} minutes</Text>
                                    </div>
                                )}
                                {movie.vote_average > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <StarOutlined style={{ color: 'white', marginRight: '8px' }} />
                                        <Text style={{ color: 'white' }}>{movie.vote_average.toFixed(1)}/10</Text>
                                        <Rate
                                            disabled
                                            allowHalf
                                            defaultValue={movie.vote_average / 2}
                                            style={{ fontSize: '14px', marginLeft: '8px' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px' }}>
                                {movie.overview}
                            </Paragraph>
                        </Col>
                    </Row>
                </div>
            </Header>

            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <Tabs defaultActiveKey="1" style={{ marginBottom: '24px' }}>
                    <TabPane tab="Trailers & Videos" key="1">
                        <Card>
                            {trailersLoading && (
                                <div style={{ textAlign: 'center', padding: '24px' }}>
                                    <Spin tip="Loading trailers..." />
                                </div>
                            )}

                            {trailersError && (
                                <Empty
                                    description="Error loading trailers"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}

                            {!trailersLoading && youtubeTrailers.length === 0 && (
                                <Empty
                                    description="No trailers available for this movie"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}

                            <Row gutter={[24, 24]}>
                                {youtubeTrailers.map(trailer => (
                                    <Col xs={24} sm={12} md={8} key={trailer.id}>
                                        <Card
                                            hoverable
                                            cover={
                                                <div style={{ position: 'relative' }}>
                                                    <img
                                                        alt={`${movie.title} - ${trailer.name}`}
                                                        src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
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
                                                title={trailer.name}
                                                description={`${trailer.type} • ${new Date(trailer.published_at).toLocaleDateString()}`}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </TabPane>
                    <TabPane tab="Details" key="2">
                        <Card>
                            <Row gutter={[24, 24]}>
                                {movie.production_companies && movie.production_companies.length > 0 && (
                                    <Col xs={24} sm={12}>
                                        <Title level={4}>Production Companies</Title>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {movie.production_companies.map(company => (
                                                <Tag key={company.id}>{company.name}</Tag>
                                            ))}
                                        </div>
                                    </Col>
                                )}

                                {movie.production_countries && movie.production_countries.length > 0 && (
                                    <Col xs={24} sm={12}>
                                        <Title level={4}>Production Countries</Title>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {movie.production_countries.map((country, index) => (
                                                <Tag key={index}>{country.name}</Tag>
                                            ))}
                                        </div>
                                    </Col>
                                )}
                            </Row>

                            <Divider />

                            <Row gutter={[24, 24]}>
                                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                                    <Col xs={24} sm={12}>
                                        <Title level={4}>Languages</Title>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {movie.spoken_languages.map((language, index) => (
                                                <Tag key={index}>{language.english_name || language.name}</Tag>
                                            ))}
                                        </div>
                                    </Col>
                                )}

                                <Col xs={24} sm={12}>
                                    <Title level={4}>Additional Info</Title>
                                    <div>
                                        {movie.budget > 0 && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <Text strong>Budget: </Text>
                                                <Text>${movie.budget.toLocaleString()}</Text>
                                            </div>
                                        )}
                                        {movie.revenue > 0 && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <Text strong>Revenue: </Text>
                                                <Text>${movie.revenue.toLocaleString()}</Text>
                                            </div>
                                        )}
                                        {movie.status && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <Text strong>Status: </Text>
                                                <Text>{movie.status}</Text>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </TabPane>
                </Tabs>
            </Content>

            {/* Trailer Modal */}
            <Modal
                title={currentTrailer?.name}
                open={trailerModalVisible}
                onCancel={closeTrailer}
                footer={null}
                width="80%"
                centered
            >
                {currentTrailer && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            title={`${movie.title} - ${currentTrailer.name}`}
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
        </Layout>
    );
};