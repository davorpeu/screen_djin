// features/movieSearch/api.ts
import axios from 'axios';
import { MovieList } from '../shared/types';

export interface TMDBConfig {
    apiKey: string;
    baseUrl: string;
}

export class MovieAPI {
    private config: TMDBConfig;

    constructor(config: TMDBConfig) {
        this.config = config;
    }

    async fetchMovies(query: string, page: number = 1): Promise<MovieList> {
        const url = `${this.config.baseUrl}/search/multi?api_key=${this.config.apiKey}&query=${query}&page=${page}`;
        const response = await axios.get<MovieList>(url);
        return response.data;
    }
}

