import React, {useEffect} from 'react';
import {AppProvider} from './providers/app';
import {AppRoutes} from './routes';
import {useAuth} from './features/auth';
import './App.css';

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading, restoreSession } = useAuth();

    useEffect(() => {
        const savedSession = localStorage.getItem('tmdbSession');
        if (savedSession && !isAuthenticated && !loading) {
            restoreSession(savedSession);
        }
    }, [isAuthenticated, loading, restoreSession]);

    return <>{children}</>;
};

function App() {
    return (
        <AppProvider>
            <AuthInitializer>
                <AppRoutes />
            </AuthInitializer>
        </AppProvider>
    );
}

export default App;