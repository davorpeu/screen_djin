// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/stores';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '@/stores';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// src/hooks/useMovies.ts
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchMovieDetails, fetchTrendingMovies } from '@/stores/slices/moviesSlice';

export const useMovies = () => {
  const dispatch = useAppDispatch();
  const { trending, selectedMovie, status, error } = useAppSelector((state) => state.movies);

  const getTrending = (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    dispatch(fetchTrendingMovies({ mediaType, timeWindow }));
  };

  const getMovieDetails = (id: number, mediaType: 'movie' | 'tv') => {
    dispatch(fetchMovieDetails({ id, mediaType }));
  };

  return {
    trending,
    selectedMovie,
    status,
    error,
    getTrending,
    getMovieDetails,
  };
};

// src/hooks/useSearch.ts
import { useAppDispatch, useAppSelector } from '@/hooks';
import { performSearch, setSearchTerm, setPage, updateFilters, resetFilters } from '@/stores/slices/searchSlice';
import { SearchParams } from '@/types/movie.types';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { results, totalPages, currentPage, searchTerm, filters, status, error } = useAppSelector(
    (state) => state.search
  );

  const search = () => {
    if (!searchTerm.trim()) return;

    const params: SearchParams = {
      query: searchTerm,
      page: currentPage,
      ...filters,
    };

    dispatch(performSearch(params));
  };

  const changeSearchTerm = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const changePage = (page: number) => {
    dispatch(setPage(page));
  };

  const applyFilters = (newFilters: Partial<Omit<SearchParams, 'query' | 'page'>>) => {
    dispatch(updateFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  return {
    results,
    totalPages,
    currentPage,
    searchTerm,
    filters,
    status,
    error,
    search,
    changeSearchTerm,
    changePage,
    applyFilters,
    clearFilters,
  };
};

// src/hooks/useMovieLists.ts
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  createList,
  deleteList,
  addMovieToList,
  removeMovieFromList,
  renameList
} from '@/stores/slices/movieListsSlice';
import { Movie } from '@/types/movie.types';

export const useMovieLists = () => {
  const dispatch = useAppDispatch();
  const { lists } = useAppSelector((state) => state.movieLists);

  const create = (name: string) => {
    dispatch(createList(name));
  };

  const remove = (listId: string) => {
    dispatch(deleteList(listId));
  };

  const addMovie = (listId: string, movie: Movie) => {
    dispatch(addMovieToList({ listId, movie }));
  };

  const removeMovie = (listId: string, movieId: number) => {
    dispatch(removeMovieFromList({ listId, movieId }));
  };

  const rename = (listId: string, name: string) => {
    dispatch(renameList({ listId, name }));
  };

  return {
    lists,
    create,
    remove,
    addMovie,
    removeMovie,
    rename,
  };
};

// src/hooks/index.ts
export * from './useAppDispatch';
export * from './useAppSelector';
export * from './useMovies';
export * from './useSearch';
export * from './useMovieLists';