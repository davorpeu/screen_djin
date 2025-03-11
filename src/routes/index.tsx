import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage';
import { SearchPage } from '../features/search/SearchPage';
/*import { DetailsPage } from '../features/details/DetailsPage';
import { MyListsPage } from '../features/lists/MyListsPage';*/

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
        {/*    <Route path="/:mediaType/:id" element={<DetailsPage />} />
            <Route path="/lists" element={<MyListsPage />} />*/}
        </Routes>
    );
};

