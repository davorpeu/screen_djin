import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'hooks/useAppDispatch.ts';
import { useAppSelector } from 'hooks/useAppSelector';
import { fetchMovieDetails } from 'store/slices/moviesSlice';
import { addToList } from 'store/slices/userListsSlice';
import { Cast, Video } from 'types/movie.types';
import './MovieDetailsPage.css';

export const MovieDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { data: movie, loading, error } = useAppSelector(state => state.movies.movieDetails);
    const userLists = useAppSelector(state => state.userLists.lists);

    useEffect(() => {
        if (id) {
            dispatch(fetchMovieDetails(Number(id)))
        }
    }//TODO
    
