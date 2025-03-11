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