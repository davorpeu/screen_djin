import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {listsApi} from '../api/listsApi';
import {AddMovieRequest, CreateListRequest, ListsState} from '../types';
import {RootState} from "@/stores";

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

export const fetchUserLists = createAsyncThunk(
    'lists/fetchUserLists',
    async ({ accountId, sessionId }: { accountId: number, sessionId: string }, { rejectWithValue }) => {
        try {
            const response = await listsApi.getUserLists(accountId, sessionId);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch lists');
        }
    }
);

export const fetchListDetails = createAsyncThunk(
    'lists/fetchListDetails',
    async (listId: number, { rejectWithValue }) => {
        try {
            const response = await listsApi.getListDetails(listId);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch list details');
        }
    }
);

export const createList = createAsyncThunk(
    'lists/createList',
    async ({ sessionId, listData }: { sessionId: string, listData: CreateListRequest }, { rejectWithValue }) => {
        try {
            const response = await listsApi.createList(sessionId, listData);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create list');
        }
    }
);
export const updateList = createAsyncThunk(
    'lists/updateList',
    async ({ listId, name, description }: { listId: number, name: string, description: string }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const sessionId = state.auth.sessionId;

            if (!sessionId) {
                return rejectWithValue('No session ID found');
            }

            const response = await listsApi.updateList(listId, sessionId, { name, description });
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return { ...response.data, listId };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update list');
        }
    }
);

export const addMovieToList = createAsyncThunk(
    'lists/addMovieToList',
    async ({ listId, sessionId, movieData }: { listId: number, sessionId: string, movieData: AddMovieRequest }, { rejectWithValue }) => {
        try {
            const response = await listsApi.addMovieToList(listId, sessionId, movieData);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add movie to list');
        }
    }
);

export const removeMovieFromList = createAsyncThunk(
    'lists/removeMovieFromList',
    async ({ listId, sessionId, movieData }: { listId: number, sessionId: string, movieData: AddMovieRequest }, { rejectWithValue }) => {
        try {
            const response = await listsApi.removeMovieFromList(listId, sessionId, movieData);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to remove movie from list');
        }
    }
);

export const deleteList = createAsyncThunk(
    'lists/deleteList',
    async ({ listId, sessionId }: { listId: number, sessionId: string }, { rejectWithValue }) => {
        try {
            const response = await listsApi.deleteList(listId, sessionId);
            if (response.error) {
                return rejectWithValue(response.error);
            }
            return { ...response.data, listId };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete list');
        }
    }
);

const listsSlice = createSlice({
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
            .addCase(updateList.pending, (state) => {
                state.operations.loading = true;
                state.operations.error = null;
                state.operations.success = false;
            })
            .addCase(updateList.fulfilled, (state, action) => {
                state.operations.loading = false;
                state.operations.success = action.payload.success;
                state.operations.message = action.payload.status_message;

                if (action.payload.success && state.userLists.items) {
                    state.userLists.items = state.userLists.items.map(list =>
                        list.id === action.payload.listId
                            ? { ...list, name: action.meta.arg.name, description: action.meta.arg.description }
                            : list
                    );
                }
            })
            .addCase(updateList.rejected, (state, action) => {
                state.operations.loading = false;
                state.operations.error = action.payload as string;
                state.operations.success = false;
            })

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

            .addCase(deleteList.pending, (state) => {
                state.operations.loading = true;
                state.operations.error = null;
                state.operations.success = false;
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                state.operations.loading = false;
                state.operations.success = action.payload.success;
                state.operations.message = action.payload.status_message;

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

export const { clearListsOperation } = listsSlice.actions;
export default listsSlice.reducer;