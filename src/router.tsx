import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from './routes/index';

export const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};