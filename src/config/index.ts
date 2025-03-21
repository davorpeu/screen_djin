export const API_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
    small: 'w200',
    medium: 'w500',
    large: 'original'
};
export const BACKDROP_SIZES = {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
};