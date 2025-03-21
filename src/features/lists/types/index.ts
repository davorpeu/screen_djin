import {Movie} from '@/features/movies';

export interface List {
    description: string;
    favorite_count: number;
    id: number;
    item_count: number;
    iso_639_1: string;
    list_type: string;
    name: string;
    poster_path: string | null;
}export interface UpdateListRequest {
    id: number;
    name: string;
    description: string;
}

export interface MovieList extends List {
    created_by: string;
    items: Movie[];
}

export interface CreateListRequest {
    name: string;
    description: string;
    language?: string;
}

export interface AddMovieRequest {
    media_id: number;
}

export interface ListsState {
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
