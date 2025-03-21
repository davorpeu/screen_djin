import {Video} from '@/types/movie';

export const getYouTubeTrailers = (trailers: Video[]) => {
    if (!trailers || !Array.isArray(trailers)) return [];

    return trailers.filter(
        trailer =>
            trailer.site?.toLowerCase() === 'youtube' &&
            (trailer.type?.toLowerCase() === 'trailer' || trailer.type?.toLowerCase() === 'teaser')
    );
};

export const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};