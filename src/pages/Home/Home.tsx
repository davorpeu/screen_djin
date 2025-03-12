import React, { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { MoviesList } from '../../components/movies/MoviesList';
import { fetchPopularMovies, fetchTopRatedMovies } from '../../store/slices/movieSlice';
import { Layout, Card, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchPopularMovies());
        dispatch(fetchTopRatedMovies());
    }, [dispatch]);

    return (
        <Layout className="home-page">
            <Header className="hero">
                <div className="hero__content">
                    <Title level={1}>Discover Movies & TV Shows</Title>
                    <Text className="hero__description">
                        Find and track your favorite entertainment from around the world
                    </Text>
                </div>
            </Header>

            <Content className="content-section">
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
            </Content>
        </Layout>
    );
};