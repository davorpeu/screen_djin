import React from 'react';
import { Route, Routes } from 'react-router-dom';
/*import { DetailsPage } from '../features/details/DetailsPage';
import { MyListsPage } from '../features/lists/MyListsPage';*/
import {MoviesListContainer} from '../features/moviesList/components/moviesListContainer'
import {MovieDetails} from "../features/movie/components/MovieDetails";
export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MoviesListContainer />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

        {/*    <Route path="/:mediaType/:id" element={<DetailsPage />} />
            <Route path="/lists" element={<MyListsPage />} />*/}
        </Routes>
    );
};

