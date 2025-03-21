import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppRoutes} from '@/routes';

export const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};