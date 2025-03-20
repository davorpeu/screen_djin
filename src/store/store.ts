import { configureStore } from '@reduxjs/toolkit';
import { moviesReducer } from './slices/movieSlice';
import { searchReducer } from './slices/searchSlice';
import {authReducer} from "./slices/authSlice";
import {listsReducer} from "./slices/listSlice";

// Create store with proper type annotations
export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        search: searchReducer,
        auth: authReducer,
        lists: listsReducer,
    },
});

// Export types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;