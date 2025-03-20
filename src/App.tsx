// src/App.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Router } from './router';
import { useAppDispatch, useAppSelector } from "./hooks";
import { restoreSession } from "./store/slices/authSlice";
import './App.css';

// AuthInitializer component to handle session restoration
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const {  isAuthenticated, loading } = useAppSelector(state => state.auth);

    useEffect(() => {
        const savedSession = localStorage.getItem('tmdbSession');
        if (savedSession && !isAuthenticated && !loading) {
            dispatch(restoreSession(savedSession));
        }
    }, [dispatch, isAuthenticated, loading]);

    return <>{children}</>;
};

function App() {
    return (
        <Provider store={store}>
            <AuthInitializer>
                <div style={{
                    height: '100vh',
                    width: '100%'
                }}>
                    <Router />
                </div>
            </AuthInitializer>
        </Provider>
    );
}

export default App;