import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppRoutes} from '@/routes';

export const Router: React.FC = () => {
    return (
        <BrowserRouter basename="/screen_djin">
            <AppRoutes />
        </BrowserRouter>
    );
};