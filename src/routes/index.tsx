// src/routes/index.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MoviesListContainer } from '../features/moviesList/components/moviesListContainer';
import { MovieDetails } from "../features/movie/components/MovieDetails";
import { ListDetail } from "../features/lists/components/ListDetail";
import { LoginPage } from '../features/auth/components/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Create a simple NotFoundPage component
const NotFoundPage = () => (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
    </div>
);

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes wrapped with AppLayout */}
            <Route path="/" element={
                <ProtectedRoute>
                    <AppLayout>
                        <MoviesListContainer />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/movie/:id" element={
                <ProtectedRoute>
                    <AppLayout>
                        <MovieDetails />
                    </AppLayout>
                </ProtectedRoute>
            } />

            {/* List routes */}
            <Route path="/list/:id" element={
                <ProtectedRoute>
                    <AppLayout>
                        <ListDetail />
                    </AppLayout>
                </ProtectedRoute>
            } />

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};