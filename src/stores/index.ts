import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {authReducer} from '@/features/auth';
import {moviesReducer} from '@/features/movies';
import {searchReducer} from '@/features/movies/stores/searchSlice';
import {listsReducer} from '@/features/lists';

const rootReducer = combineReducers({
    auth: authReducer,
    movies: moviesReducer,
    search: searchReducer,
    lists: listsReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
    devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch