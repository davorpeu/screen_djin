export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    media_type?: string;
}

export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number;
    status: string;
    tagline: string;
    videos: {
        results: Video[];
    };
    credits: {
        cast: Cast[];
        crew: Crew[];
    };
    reviews: {
        results: Review[];
    };
}

export interface TvShow {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    media_type?: string;
}

export interface TvShowDetails extends TvShow {
    genres: Genre[];
    episode_run_time: number[];
    status: string;
    tagline: string;
    number_of_seasons: number;
    number_of_episodes: number;
    videos: {
        results: Video[];
    };
    credits: {
        cast: Cast[];
        crew: Crew[];
    };
    reviews: {
        results: Review[];
    };
}

export interface Genre {
    id: number;
    name: string;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
}

export interface Review {
    id: string;
    author: string;
    content: string;
    created_at: string;
}

export interface SearchResults {
    page: number;
    results: (Movie | TvShow)[];
    total_pages: number;
    total_results: number;
}

export interface MovieList {
    id: string;
    name: string;
    description: string;
    items: (Movie | TvShow)[];
    createdAt: string;
}