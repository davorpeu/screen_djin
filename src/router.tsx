import React from 'react';
import {HashRouter} from 'react-router-dom';
import {AppRoutes} from '@/routes';

export const Router: React.FC = () => {
    return (
         <HashRouter basename="/screen_djin">
            <AppRoutes />
         </HashRouter>
    );
};