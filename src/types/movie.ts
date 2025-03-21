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
    budget: number;
    revenue: number;
    status: string;
    tagline: string;
    videos?: {
        results: Video[];
    };
    credits?: {
        cast: Cast[];
        crew: Crew[];
    };
    reviews?: {
        results: Review[];
    };
    production_companies?: ProductionCompany[];
    production_countries?: ProductionCountry[];
    spoken_languages?: SpokenLanguage[];
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    published_at?: string;
    official?: boolean;
    size?: number;
}

export interface Genre {
    id: number;
    name: string;
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
    url?: string;
    author_details?: {
        rating?: number;
        avatar_path?: string;
        username?: string;
    };
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    english_name?: string;
    iso_639_1: string;
    name: string;
}

export interface SearchResults {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetailsState {
    data: MovieDetails | null;
    trailers: Video[];
    reviews: Review[];
    loading: boolean;
    trailersLoading: boolean;
    reviewsLoading: boolean;
    error: string | null;
    trailersError: string | null;
    reviewsError: string | null;
    reviewsTotalPages: number;
}

export interface MoviesState {
    popular: {
        results: Movie[];
        page: number;
        total_pages: number;
        loading: boolean;
        error: string | null;
    };
    topRated: {
        results: Movie[];
        page: number;
        total_pages: number;
        loading: boolean;
        error: string | null;
    };
    movieDetails: MovieDetailsState;
    byGenre: Record<number, {
        results: Movie[];
        page: number;
        total_pages: number;
        loading: boolean;
        error: string | null;
    }>;
}

export interface SearchState {
    results: Movie[];
    loading: boolean;
    error: string | null;
    total_pages: number;
    currentPage: number;
}
