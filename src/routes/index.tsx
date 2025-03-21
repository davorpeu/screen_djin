import React, {lazy, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {AppLayout} from '@/components/layout/AppLayout';
import {LoginPage} from '@/features/auth';
import {ProtectedRoute} from './ProtectedRoute';
import {LoadingPage} from '@/components/ui/LoadingPage';

const HomePage = lazy(() => import('@/features/movies').then(mod => ({ default: mod.MoviesListContainer })));
const MovieDetailsPage = lazy(() => import('@/features/movieDetails').then(mod => ({ default: mod.MovieDetails })));
const ListDetailsPage = lazy(() => import('@/features/lists').then(mod => ({ default: mod.ListDetailContainer })));

const NotFoundPage = () => (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
    </div>
);

export const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/list/:id" element={
                    <AppLayout>
                        <ListDetailsPage />
                    </AppLayout>
                } />
                <Route path="/movie/:id" element={
                    <AppLayout>
                        <MovieDetailsPage />
                    </AppLayout>
                } />
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={
                        <AppLayout>
                            <HomePage />
                        </AppLayout>
                    } />

                </Route>

                {/* Catch-all route for 404s */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};