// src/store/slices/userListsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie, TvShow, MovieList } from '../../types/movie.types';

// Helper function to get saved lists from localStorage
const getSavedLists = (): MovieList[] => {
    const savedLists = localStorage.getItem('userLists');
    return savedLists ? JSON.parse(savedLists) : [];
};

// Helper function to save lists to localStorage
const saveLists = (lists: MovieList[]) => {
    localStorage.setItem('userLists', JSON.stringify(lists));
};

// Define types for user lists state
interface UserListsState {
    lists: MovieList[];
}

// Define initial state
const initialState: UserListsState = {
    lists: getSavedLists(),
};

// Create slice with reducers
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

// Export the slice's actions
export const {
    createList,
    updateList,
    deleteList,
    addToList,
    removeFromList,
} = userListsSlice.actions;

// Export the reducer
export const userListsReducer = userListsSlice.reducer;