// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { moviesReducer } from './slices/movieSlice';
import { searchReducer } from './slices/SearchSlicer';
import { userListsReducer } from './slices/userListsSlice';

// Define the root state type
export type RootState = {
    movies: ReturnType<typeof moviesReducer>;
    search: ReturnType<typeof searchReducer>;
    userLists: ReturnType<typeof userListsReducer>;
};

// Create store with proper type annotations
export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        search: searchReducer,
        userLists: userListsReducer,
    },
});

// Export typed dispatch
export type AppDispatch = typeof store.dispatch;

// Export hooks with proper types
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = (selector: (state: RootState) => any) =>
    selector(store.getState());