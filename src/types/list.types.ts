// src/types/list.types.ts
import { Movie } from './movie.types';

export interface List {
    description: string;
    favorite_count: number;
    id: number;
    item_count: number;
    iso_639_1: string;
    list_type: string;
    name: string;
    poster_path: string | null;
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