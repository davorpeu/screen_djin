import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {moviesApi} from '../api/moviesApi';
import {MovieDetails, MoviesState, SearchResults} from '@/types/movie';

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
        reviews: [],
        loading: false,
        trailersLoading: false,
        reviewsLoading: false,
        error: null,
        trailersError: null,
        reviewsError: null,
        reviewsTotalPages: 0
    },
    byGenre: {},
};

export const fetchPopularMovies = createAsyncThunk(
    'movies/fetchPopular',
    async (page: number = 1, { rejectWithValue }) => {
        try {
            const response = await moviesApi.getPopularMovies(page);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch popular movies');
        }
    }
);

export const fetchTopRatedMovies = createAsyncThunk(
    'movies/fetchTopRated',
    async (page: number = 1, { rejectWithValue }) => {
        try {
            const response = await moviesApi.getTopRatedMovies(page);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch top rated movies');
        }
    }
);

export const fetchMovieDetails = createAsyncThunk(
    'movies/fetchDetails',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await moviesApi.getMovieDetails(id);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch movie details');
        }
    }
);

export const fetchMovieTrailers = createAsyncThunk(
    'movies/fetchTrailers',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await moviesApi.getMovieVideos(id);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch movie trailers');
        }
    }
);

export const fetchMovieReviews = createAsyncThunk(
    'movies/fetchReviews',
    async ({ movieId, page = 1 }: { movieId: number; page: number }, { rejectWithValue }) => {
        try {
            const response = await moviesApi.getMovieReviews(movieId, page);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch movie reviews');
        }
    }
);

export const fetchMoviesByGenre = createAsyncThunk(
    'movies/fetchByGenre',
    async ({ genreId, page = 1 }: { genreId: number; page: number }, { rejectWithValue }) => {
        try {
            const response = await moviesApi.getMoviesByGenre(genreId, page);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return { ...response.data, genreId };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch movies by genre');
        }
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularMovies.pending, (state) => {
                state.popular.loading = true;
                state.popular.error = null;
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.popular.loading = false;
                state.popular.results = action.payload.results;
                state.popular.page = action.payload.page;
                state.popular.total_pages = action.payload.total_pages;
            })
            .addCase(fetchPopularMovies.rejected, (state, action) => {
                state.popular.loading = false;
                state.popular.error = action.payload as string || 'Failed to fetch popular movies';
            })

            .addCase(fetchTopRatedMovies.pending, (state) => {
                state.topRated.loading = true;
                state.topRated.error = null;
            })
            .addCase(fetchTopRatedMovies.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.topRated.loading = false;
                state.topRated.results = action.payload.results;
                state.topRated.page = action.payload.page;
                state.topRated.total_pages = action.payload.total_pages;
            })
            .addCase(fetchTopRatedMovies.rejected, (state, action) => {
                state.topRated.loading = false;
                state.topRated.error = action.payload as string || 'Failed to fetch top rated movies';
            })

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
                state.movieDetails.error = action.payload as string || 'Failed to fetch movie details';
            })

            .addCase(fetchMovieTrailers.pending, (state) => {
                state.movieDetails.trailersLoading = true;
                state.movieDetails.trailersError = null;
            })
            .addCase(fetchMovieTrailers.fulfilled, (state, action) => {
                state.movieDetails.trailersLoading = false;
                state.movieDetails.trailers = action.payload.results;
            })
            .addCase(fetchMovieTrailers.rejected, (state, action) => {
                state.movieDetails.trailersLoading = false;
                state.movieDetails.trailersError = action.payload as string || 'Failed to fetch movie trailers';
            })

            .addCase(fetchMovieReviews.pending, (state) => {
                state.movieDetails.reviewsLoading = true;
                state.movieDetails.reviewsError = null;
            })
            .addCase(fetchMovieReviews.fulfilled, (state, action) => {
                state.movieDetails.reviewsLoading = false;
                state.movieDetails.reviews = action.payload.results;
                state.movieDetails.reviewsTotalPages = action.payload.total_pages;
            })
            .addCase(fetchMovieReviews.rejected, (state, action) => {
                state.movieDetails.reviewsLoading = false;
                state.movieDetails.reviewsError = action.payload as string || 'Failed to fetch movie reviews';
            })

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
                    results: results,
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
                    state.byGenre[genreId].error = action.payload as string || 'Failed to fetch movies by genre';
                }
            });
    },
});

export default moviesSlice.reducer;