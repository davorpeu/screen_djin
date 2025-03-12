// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import movieSearchReducer from '../features/movieSearch/slice';

export const store = configureStore({
    reducer: {
        movies: movieSearchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;