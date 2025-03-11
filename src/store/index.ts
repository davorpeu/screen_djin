// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import tvShowsReducer from './slices/tvShowsSlice';
import searchReducer from './slices/searchSlice';
import userListsReducer from './slices/userListsSlice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        tvShows: tvShowsReducer,
        search: searchReducer,
        userLists: userListsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/hooks/useAppDispatch.ts.ts
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;