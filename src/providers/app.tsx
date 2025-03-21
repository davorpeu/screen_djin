import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {store} from '@/stores';

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <ReduxProvider store={store}>
            <Router>
                {children}
            </Router>
        </ReduxProvider>
    );
};