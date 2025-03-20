// src/store/slices/listSlice.ts
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { listApi } from '../../services/api/listApi';
import { List, MovieList, CreateListRequest, AddMovieRequest } from '../../types/list.types';

interface ListsState {
    userLists: {
        items: List[];
        loading: boolean;
        error: string | null;
    };
    currentList: {
        data: MovieList | null;
        loading: boolean;
        error: string | null;
    };
    operations: {
        loading: boolean;
        error: string | null;
        success: boolean;
        message: string;
    };
}

const initialState: ListsState = {
    userLists: {
        items: [],
        loading: false,
        error: null
    },
    currentList: {
        data: null,
        loading: false,
        error: null
    },
    operations: {
        loading: false,
        error: null,
        success: false,
        message: ''
    }
};

// Get user lists
export const fetchUserLists = createAsyncThunk(
    'lists/fetchUserLists',
    async ({ accountId, sessionId }: { accountId: number, sessionId: string }, { rejectWithValue }) => {
        try {
            return await listApi.getUserLists(accountId, sessionId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch lists');
        }
    }
);
// Get list details
export const fetchListDetails = createAsyncThunk(
    'lists/fetchListDetails',
    async (listId: number, { rejectWithValue }) => {
        try {
            return await listApi.getListDetails(listId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to fetch list details');
        }
    }
);

// Create a list
export const createList = createAsyncThunk(
    'lists/createList',
    async ({ sessionId, listData }: { sessionId: string, listData: CreateListRequest }, { rejectWithValue }) => {
        try {
            return await listApi.createList(sessionId, listData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to create list');
        }
    }
);

// Add movie to list
export const addMovieToList = createAsyncThunk(
    'lists/addMovieToList',
    async ({ listId, sessionId, movieData }: { listId: number, sessionId: string, movieData: AddMovieRequest }, { rejectWithValue }) => {
        try {
            return await listApi.addMovieToList(listId, sessionId, movieData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to add movie to list');
        }
    }
);

// Remove movie from list
export const removeMovieFromList = createAsyncThunk(
    'lists/removeMovieFromList',
    async ({ listId, sessionId, movieData }: { listId: number, sessionId: string, movieData: AddMovieRequest }, { rejectWithValue }) => {
        try {
            return await listApi.removeMovieFromList(listId, sessionId, movieData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to remove movie from list');
        }
    }
);

// Delete a list
export const deleteList = createAsyncThunk(
    'lists/deleteList',
    async ({ listId, sessionId }: { listId: number, sessionId: string }, { rejectWithValue }) => {
        try {
            const result = await listApi.deleteList(listId, sessionId);
            return { ...result, listId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.status_message || 'Failed to delete list');
        }
    }
);

const listSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {
        clearListsOperation: (state) => {
            state.operations = {
                loading: false,
                error: null,
                success: false,
                message: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch user lists
            .addCase(fetchUserLists.pending, (state) => {
                state.userLists.loading = true;
                state.userLists.error = null;
            })
            .addCase(fetchUserLists.fulfilled, (state, action) => {
                state.userLists.loading = false;
                state.userLists.items = action.payload.results;
            })
            .addCase(fetchUserLists.rejected, (state, action) => {
                state.userLists.loading = false;
                state.userLists.error = action.payload as string;
            })

            // Fetch list details
            .addCase(fetchListDetails.pending, (state) => {
                state.currentList.loading = true;
                state.currentList.error = null;
            })
            .addCase(fetchListDetails.fulfilled, (state, action) => {
                state.currentList.loading = false;
                state.currentList.data = action.payload;
            })
            .addCase(fetchListDetails.rejected, (state, action) => {
                state.currentList.loading = false;
                state.currentList.error = action.payload as string;
            })

            // Create list
            .addCase(createList.pending, (state) => {
                state.operations.loading = true;
                state.operations.error = null;
                state.operations.success = false;
            })
            .addCase(createList.fulfilled, (state, action) => {
                state.operations.loading = false;
                state.operations.success = action.payload.success;
                state.operations.message = action.payload.status_message;
            })
            .addCase(createList.rejected, (state, action) => {
                state.operations.loading = false;
                state.operations.error = action.payload as string;
                state.operations.success = false;
            })

            // Add movie to list
            .addCase(addMovieToList.pending, (state) => {
                state.operations.loading = true;
                state.operations.error = null;
                state.operations.success = false;
            })
            .addCase(addMovieToList.fulfilled, (state, action) => {
                state.operations.loading = false;
                state.operations.success = action.payload.success;
                state.operations.message = action.payload.status_message;
            })
            .addCase(addMovieToList.rejected, (state, action) => {
                state.operations.loading = false;
                state.operations.error = action.payload as string;
                state.operations.success = false;
            })

            // Remove movie from list
            .addCase(removeMovieFromList.pending, (state) => {
                state.operations.loading = true;
                state.operations.error = null;
                state.operations.success = false;
            })
            .addCase(removeMovieFromList.fulfilled, (state, action) => {
                state.operations.loading = false;
                state.operations.success = action.payload.success;
                state.operations.message = action.payload.status_message;
            })
            .addCase(removeMovieFromList.rejected, (state, action) => {
                state.operations.loading = false;
                state.operations.error = action.payload as string;
                state.operations.success = false;
            })

            // Delete list
            .addCase(deleteList.pending, (state) => {
                state.operations.loading = true;
                state.operations.error = null;
                state.operations.success = false;
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                state.operations.loading = false;
                state.operations.success = action.payload.success;
                state.operations.message = action.payload.status_message;

                // Remove deleted list from state
                if (action.payload.success) {
                    state.userLists.items = state.userLists.items.filter(
                        list => list.id !== action.payload.listId
                    );
                }
            })
            .addCase(deleteList.rejected, (state, action) => {
                state.operations.loading = false;
                state.operations.error = action.payload as string;
                state.operations.success = false;
            });
    }
});

export const { clearListsOperation } = listSlice.actions;
export const listsReducer = listSlice.reducer;