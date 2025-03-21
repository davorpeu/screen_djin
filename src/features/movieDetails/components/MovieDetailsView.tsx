import React from 'react';
import {
    Avatar,
    Card,
    Col,
    Divider,
    Empty,
    Layout,
    List,
    Modal,
    Pagination,
    Rate,
    Row,
    Spin,
    Tabs,
    Tag,
    Typography
} from 'antd';
import {Comment} from '@ant-design/compatible';
import {CalendarOutlined, ClockCircleOutlined, PlayCircleOutlined, StarOutlined, UserOutlined} from '@ant-design/icons';
import {MovieDetails, Review, Video} from '@/types/movie';
import {formatReviewDate} from '../../movies/utils/movieUtils';
import {BACKDROP_SIZES, IMAGE_BASE_URL, POSTER_SIZES} from '@/config';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface MovieDetailsViewProps {
    movie: MovieDetails;
    trailers: Video[];
    reviews: Review[];
    reviewsTotalPages: number;

    loading: boolean;
    error: string | null;
    trailersLoading: boolean;
    reviewsLoading: boolean;
    currentTrailer: Video | null;
    trailerModalVisible: boolean;
    reviewPage: number;

    onOpenTrailer: (trailer: Video) => void;
    onCloseTrailer: () => void;
    onReviewPageChange: (page: number) => void;
}

export const MovieDetailsView: React.FC<MovieDetailsViewProps> = ({
                                                                      movie,
                                                                      trailers,
                                                                      reviews,
                                                                      reviewsTotalPages,
                                                                      loading,
                                                                      error,
                                                                      trailersLoading,
                                                                      reviewsLoading,
                                                                      currentTrailer,
                                                                      trailerModalVisible,
                                                                      reviewPage,
                                                                      onOpenTrailer,
                                                                      onCloseTrailer,
                                                                      onReviewPageChange
                                                                  }) => {
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

    return (
        <Layout>
            {/* Movie Header/Hero Section */}
            <Header style={{
                height: 'auto',
                padding: '40px 0 20px',
                background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${IMAGE_BASE_URL}/${BACKDROP_SIZES.large}${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} sm={24} md={8} lg={6}>
                            <img
                                src={movie.poster_path
                                    ? `${IMAGE_BASE_URL}/${POSTER_SIZES.medium}${movie.poster_path}`
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

                            {!trailersLoading && trailers.length === 0 && (
                                <Empty
                                    description="No trailers available for this movie"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}

                            <Row gutter={[24, 24]}>
                                {trailers.map(trailer => (
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
                                                        onClick={() => onOpenTrailer(trailer)}
                                                    />
                                                </div>
                                            }
                                            onClick={() => onOpenTrailer(trailer)}
                                        >
                                            <Card.Meta
                                                title={trailer.name}
                                                description={`${trailer.type} ${trailer.published_at ? `• ${new Date(trailer.published_at).toLocaleDateString()}` : ''}`}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </TabPane>

                    <TabPane tab="Reviews" key="2">
                        <Card>
                            {reviewsLoading && (
                                <div style={{ textAlign: 'center', padding: '24px' }}>
                                    <Spin tip="Loading reviews..." />
                                </div>
                            )}

                            {!reviewsLoading && (!reviews || reviews.length === 0) && (
                                <Empty
                                    description="No reviews available for this movie"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}

                            {!reviewsLoading && reviews && reviews.length > 0 && (
                                <>
                                    <List
                                        itemLayout="vertical"
                                        dataSource={reviews}
                                        renderItem={(review) => {
                                            const avatarUrl = review.author_details?.avatar_path
                                                ? (review.author_details.avatar_path.startsWith('/')
                                                    ? `${IMAGE_BASE_URL}/w45${review.author_details.avatar_path}`
                                                    : review.author_details.avatar_path)
                                                : null;

                                            const rating = review.author_details?.rating;

                                            return (
                                                <List.Item>
                                                    <Comment
                                                        author={
                                                            <div>
                                                                <Text strong>{review.author}</Text>
                                                                {rating && (
                                                                    <div style={{ marginTop: '4px' }}>
                                                                        <Rate
                                                                            disabled
                                                                            allowHalf
                                                                            defaultValue={rating / 2}
                                                                            style={{ fontSize: '14px' }}
                                                                        />
                                                                        <Text style={{ marginLeft: '8px' }}>
                                                                            {rating.toFixed(1)}/10
                                                                        </Text>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        }
                                                        avatar={
                                                            <Avatar
                                                                src={avatarUrl}
                                                                icon={!avatarUrl ? <UserOutlined /> : undefined}
                                                                style={{ backgroundColor: !avatarUrl ? '#1890ff' : undefined }}
                                                            />
                                                        }
                                                        content={
                                                            <div>
                                                                <Paragraph
                                                                    ellipsis={{
                                                                        rows: 3,
                                                                        expandable: true,
                                                                        symbol: 'Read more'
                                                                    }}
                                                                >
                                                                    {review.content}
                                                                </Paragraph>
                                                                {review.url && (
                                                                    <a
                                                                        href={review.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ fontSize: '12px' }}
                                                                    >
                                                                        View original review
                                                                    </a>
                                                                )}
                                                            </div>
                                                        }
                                                        datetime={formatReviewDate(review.created_at)}
                                                    />
                                                </List.Item>
                                            );
                                        }}
                                    />

                                    {reviewsTotalPages > 1 && (
                                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                            <Pagination
                                                current={reviewPage}
                                                total={reviewsTotalPages * 10}
                                                onChange={onReviewPageChange}
                                                showSizeChanger={false}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </TabPane>

                    <TabPane tab="Details" key="3">
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
                                        {movie?.budget > 0 && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <Text strong>Budget: </Text>
                                                <Text>${movie.budget.toLocaleString()}</Text>
                                            </div>
                                        )}
                                        {movie.revenue > 0 && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <Text strong>Revenue: </Text>
                                                <Text>${movie?.revenue?.toLocaleString()}</Text>
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
                onCancel={onCloseTrailer}
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