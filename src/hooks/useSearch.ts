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