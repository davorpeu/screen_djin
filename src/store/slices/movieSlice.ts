// src/store/slices/moviesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from 'services/api/tmdb';
import { Movie, MovieDetails, SearchResults } from 'types/movie.types';

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
    movieDetails: {
        data: MovieDetails | null;
        loading: boolean;
        error: string | null;
    };
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
        loading: false,
        error: null,
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

export default moviesSlice.reducer;

// src/store/slices/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tmdbApi } from 'services/api/tmdb';
import { Movie, TvShow, SearchResults } from 'types/movie.types';

interface SearchState {
    results: (Movie | TvShow)[];
    page: number;
    total_pages: number;
    query: string;
    loading: boolean;
    error: string | null;
    filters: {
        type: 'all' | 'movie' | 'tv' | 'person';
        genre: number | null;
        year: number | null;
        rating: number | null;
    };
}

const initialState: SearchState = {
    results: [],
    page: 1,
    total_pages: 0,
    query: '',
    loading: false,
    error: null,
    filters: {
        type: 'all',
        genre: null,
        year: null,
        rating: null,
    },
};

export const searchContent = createAsyncThunk(
    'search/searchContent',
    async ({ query, page = 1 }: { query: string; page?: number }) => {
        const data = await tmdbApi.searchMulti(query, page);
        return { ...data, query };
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updateFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearSearch: (state) => {
            state.results = [];
            state.page = 1;
            state.total_pages = 0;
            state.query = '';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchContent.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload.results;
                state.page = action.payload.page;
                state.total_pages = action.payload.total_pages;
                state.query = action.payload.query;
            })
            .addCase(searchContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to search content';
            });
    },
});

export const { updateFilters, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

// src/store/slices/userListsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie, TvShow, MovieList } from 'types/movie.types';

interface UserListsState {
    lists: MovieList[];
}

// Get user lists from localStorage if available
const getSavedLists = (): MovieList[] => {
    const savedLists = localStorage.getItem('userLists');
    return savedLists ? JSON.parse(savedLists) : [];
};

const initialState: UserListsState = {
    lists: getSavedLists(),
};

const saveLists = (lists: MovieList[]) => {
    localStorage.setItem('userLists', JSON.stringify(lists));
};

const userListsSlice = createSlice({
    name: 'userLists',
    initialState,
    reducers: {
        createList: (state, action: PayloadAction<{ name: string; description: string }>) => {
            const newList: MovieList = {
                id: Date.now().toString(),
                name: action.payload.name,
                description: action.payload.description,
                items: [],
                createdAt: new Date().toISOString(),
            };

            state.lists.push(newList);
            saveLists(state.lists);
        },

        updateList: (state, action: PayloadAction<{ id: string; name: string; description: string }>) => {
            const { id, name, description } = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === id);

            if (listIndex !== -1) {
                state.lists[listIndex].name = name;
                state.lists[listIndex].description = description;
                saveLists(state.lists);
            }
        },

        deleteList: (state, action: PayloadAction<string>) => {
            state.lists = state.lists.filter(list => list.id !== action.payload);
            saveLists(state.lists);
        },

        addToList: (state, action: PayloadAction<{ listId: string; item: Movie | TvShow }>) => {
            const { listId, item } = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);

            if (listIndex !== -1) {
                // Check if item already exists in list
                const exists = state.lists[listIndex].items.some(
                    i => i.id === item.id && i.media_type === item.media_type
                );

                if (!exists) {
                    state.lists[listIndex].items.push(item);
                    saveLists(state.lists);
                }
            }
        },

        removeFromList: (state, action: PayloadAction<{ listId: string; itemId: number; mediaType: string }>) => {
            const { listId, itemId, mediaType } = action.payload;
            const listIndex = state.lists.findIndex(list => list.id === listId);

            if (listIndex !== -1) {
                state.lists[listIndex].items = state.lists[listIndex].items.filter(
                    item => !(item.id === itemId && item.media_type === mediaType)
                );
                saveLists(state.lists);
            }
        },
    },
});

export const {
    createList,
    updateList,
    deleteList,
    addToList,
    removeFromList,
} = userListsSlice.actions;

export default userListsSlice.reducer;