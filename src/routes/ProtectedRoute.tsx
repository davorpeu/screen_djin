import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {Spin} from 'antd';
import {useAuth} from '@/features/auth';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" tip="Verifying authentication..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
};
