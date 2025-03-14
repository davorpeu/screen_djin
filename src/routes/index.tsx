import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SearchPage } from '../features/search/SearchPage';
/*import { DetailsPage } from '../features/details/DetailsPage';
import { MyListsPage } from '../features/lists/MyListsPage';*/
import {Home} from '../features/home/Home'
import {MovieDetails} from "../features/home/MovieDetails";
export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

        {/*    <Route path="/:mediaType/:id" element={<DetailsPage />} />
            <Route path="/lists" element={<MyListsPage />} />*/}
        </Routes>
    );
};

