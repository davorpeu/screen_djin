import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from '../../services/api/tmdb';
import { Movie, MovieDetails, SearchResults } from '../../types/movie.types';

// Add trailer types
interface Trailer {
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
}

interface TrailerResponse {
    id: number;
    results: Trailer[];
}

// Update MovieDetails interface in your types file to include trailers
interface MovieDetailsState {
    data: MovieDetails | null;
    trailers: Trailer[];
    loading: boolean;
    trailersLoading: boolean;
    error: string | null;
    trailersError: string | null;
}

interface MoviesState {
    popular: {
        results: Movie[];
        page: number;
        total_pages: number;
        loading: boolean;
        error: string | null;
    };
    topRated: {
        results: Movie[];
        page: number;
        total_pages: number;
        loading: boolean;
        error: string | null;
    };
    movieDetails: MovieDetailsState;
    byGenre: Record<number, {
        results: Movie[];
        page: number;
        total_pages: number;
        loading: boolean;
        error: string | null;
    }>;
}

const initialState: MoviesState = {
    popular: {
        results: [],
        page: 1,
        total_pages: 0,
        loading: false,
        error: null,
    },
    topRated: {
        results: [],
        page: 1,
        total_pages: 0,
        loading: false,
        error: null,
    },
    movieDetails: {
        data: null,
        trailers: [],
        loading: false,
        trailersLoading: false,
        error: null,
        trailersError: null,
    },
    byGenre: {},
};

export const fetchPopularMovies = createAsyncThunk(
    'movies/fetchPopular',
    async (page: number = 1) => {
        return await tmdbApi.getPopularMovies(page);
    }
);

export const fetchTopRatedMovies = createAsyncThunk(
    'movies/fetchTopRated',
    async (page: number = 1) => {
        return await tmdbApi.getTopRatedMovies(page);
    }
);

export const fetchMovieDetails = createAsyncThunk(
    'movies/fetchDetails',
    async (id: number) => {
        return await tmdbApi.getMovieDetails(id);
    }
);

// Add new thunk for fetching movie trailers
export const fetchMovieTrailers = createAsyncThunk(
    'movies/fetchTrailers',
    async (id: number) => {
        // You'll need to implement this API method
        return await tmdbApi.getMovieVideos(id);
    }
);

export const fetchMoviesByGenre = createAsyncThunk(
    'movies/fetchByGenre',
    async ({ genreId, page = 1 }: { genreId: number; page: number }) => {
        const data = await tmdbApi.getMoviesByGenre(genreId, page);
        return { ...data, genreId };
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Popular movies
            .addCase(fetchPopularMovies.pending, (state) => {
                state.popular.loading = true;
                state.popular.error = null;
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.popular.loading = false;
                state.popular.results = action.payload.results as Movie[];
                state.popular.page = action.payload.page;
                state.popular.total_pages = action.payload.total_pages;
            })
            .addCase(fetchPopularMovies.rejected, (state, action) => {
                state.popular.loading = false;
                state.popular.error = action.error.message || 'Failed to fetch popular movies';
            })

            // Top rated movies
            .addCase(fetchTopRatedMovies.pending, (state) => {
                state.topRated.loading = true;
                state.topRated.error = null;
            })
            .addCase(fetchTopRatedMovies.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.topRated.loading = false;
                state.topRated.results = action.payload.results as Movie[];
                state.topRated.page = action.payload.page;
                state.topRated.total_pages = action.payload.total_pages;
            })
            .addCase(fetchTopRatedMovies.rejected, (state, action) => {
                state.topRated.loading = false;
                state.topRated.error = action.error.message || 'Failed to fetch top rated movies';
            })

            // Movie details
            .addCase(fetchMovieDetails.pending, (state) => {
                state.movieDetails.loading = true;
                state.movieDetails.error = null;
            })
            .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
                state.movieDetails.loading = false;
                state.movieDetails.data = action.payload;
            })
            .addCase(fetchMovieDetails.rejected, (state, action) => {
                state.movieDetails.loading = false;
                state.movieDetails.error = action.error.message || 'Failed to fetch movie details';
            })

            // Movie trailers
            .addCase(fetchMovieTrailers.pending, (state) => {
                state.movieDetails.trailersLoading = true;
                state.movieDetails.trailersError = null;
            })
            .addCase(fetchMovieTrailers.fulfilled, (state, action: PayloadAction<TrailerResponse>) => {
                state.movieDetails.trailersLoading = false;
                state.movieDetails.trailers = action.payload.results;
            })
            .addCase(fetchMovieTrailers.rejected, (state, action) => {
                state.movieDetails.trailersLoading = false;
                state.movieDetails.trailersError = action.error.message || 'Failed to fetch movie trailers';
            })

            // Movies by genre
            .addCase(fetchMoviesByGenre.pending, (state, action) => {
                const genreId = action.meta.arg.genreId;
                if (!state.byGenre[genreId]) {
                    state.byGenre[genreId] = {
                        results: [],
                        page: 1,
                        total_pages: 0,
                        loading: true,
                        error: null,
                    };
                } else {
                    state.byGenre[genreId].loading = true;
                    state.byGenre[genreId].error = null;
                }
            })
            .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
                const { genreId, results, page, total_pages } = action.payload;
                state.byGenre[genreId] = {
                    results: results as Movie[],
                    page,
                    total_pages,
                    loading: false,
                    error: null,
                };
            })
            .addCase(fetchMoviesByGenre.rejected, (state, action) => {
                const genreId = action.meta.arg.genreId;
                if (state.byGenre[genreId]) {
                    state.byGenre[genreId].loading = false;
                    state.byGenre[genreId].error = action.error.message || 'Failed to fetch movies by genre';
                }
            });
    },
});

export const moviesActions = {
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchMovieDetails,
    fetchMovieTrailers,
    fetchMoviesByGenre,
};

export const moviesReducer = moviesSlice.reducer;