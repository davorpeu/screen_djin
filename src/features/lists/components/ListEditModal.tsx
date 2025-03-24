import React, {useEffect, useState} from 'react';
import { message} from 'antd';
import { useMovies} from '@/features/movies';
import {List as MovieList, UpdateListRequest} from '../types';
import {ListEditModalView} from "@/features/lists/components/ListEditModalView";

interface ListEditModalProps {
    visible: boolean;
    list: MovieList | null;
    form: any;
    loading: boolean;
    onClose: () => void;
    onUpdate: (values: UpdateListRequest) => void;
    onAddMovie: (listId: number, movieId: number) => void;
    onRemoveMovie: (listId: number, movieId: number) => void;
}

export const ListEditModal: React.FC<ListEditModalProps> = ({
                                                                visible,
                                                                list,
                                                                onClose,
                                                                onAddMovie,
                                                                onRemoveMovie
                                                            }) => {
    const [activeTab] = useState('movies');
    const [searchTerm, setSearchTerm] = useState('');
    const { search, searchForMovies, clearSearchResults } = useMovies();
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (!visible) {
            clearSearchResults();
            setSearchTerm('');
        }
    }, [visible, clearSearchResults]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim()) {
            setSearchLoading(true);
            searchForMovies(value).finally(() => {
                setSearchLoading(false);
            });
        } else {
            clearSearchResults();
        }
    };

    const handleAddMovie = (movieId: number) => {
        if (list) {
            onAddMovie(list.id, movieId);
            message.success(`Movie added to "${list.name}"`);
        }
    };

    const handleRemoveMovie = (movieId: number) => {
        if (list) {
            onRemoveMovie(list.id, movieId);
            message.success(`Movie removed from "${list.name}"`);
        }
    };

    return (
       <ListEditModalView
           handleAddMovie={handleAddMovie}
           handleRemoveMovie={handleRemoveMovie}
           handleSearch={handleSearch}
           searchLoading={searchLoading}
           searchTerm={searchTerm}
           activeTab={activeTab}
           visible={visible}
           list={list}
           onRemoveMovie={onRemoveMovie}
           loading={searchLoading}
           search={search}
           setSearchTerm={setSearchTerm}
           onClose={onClose}
       />
    );
};