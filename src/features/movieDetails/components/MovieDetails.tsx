import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useMovies} from '@/features/movies';
import {Video} from '@/types/movie';
import {getYouTubeTrailers} from '../../movies/utils/movieUtils';
import {MovieDetailsView} from './MovieDetailsView';

export const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const movieId = Number(id);

    const [currentTrailer, setCurrentTrailer] = useState<Video | null>(null);
    const [trailerModalVisible, setTrailerModalVisible] = useState<boolean>(false);
    const [reviewPage, setReviewPage] = useState<number>(1);

    const { movies, getMovieDetails, getMovieTrailers, getMovieReviews } = useMovies();
    const { data: movie, loading, error, trailers, trailersLoading, reviews, reviewsLoading, reviewsTotalPages } = movies.movieDetails;

    useEffect(() => {
        getMovieDetails(movieId);
        getMovieTrailers(movieId);
        getMovieReviews(movieId, reviewPage);
    }, [getMovieDetails, getMovieTrailers, getMovieReviews, movieId, reviewPage]);

    const handleOpenTrailer = (trailer: Video): void => {
        setCurrentTrailer(trailer);
        setTrailerModalVisible(true);
    };

    const handleCloseTrailer = (): void => {
        setTrailerModalVisible(false);
        setCurrentTrailer(null);
    };

    const handleReviewPageChange = (page: number) => {
        setReviewPage(page);
        window.scrollTo(0, 0);
    };

    const youtubeTrailers = getYouTubeTrailers(trailers || []);

    return (
        <MovieDetailsView
            movie={movie!}
            trailers={youtubeTrailers}
            reviews={reviews || []}
            reviewsTotalPages={reviewsTotalPages || 0}
            loading={loading}
            error={error}
            trailersLoading={trailersLoading}
            reviewsLoading={reviewsLoading}
            currentTrailer={currentTrailer}
            trailerModalVisible={trailerModalVisible}
            reviewPage={reviewPage}
            onOpenTrailer={handleOpenTrailer}
            onCloseTrailer={handleCloseTrailer}
            onReviewPageChange={handleReviewPageChange}
        />
    );
};