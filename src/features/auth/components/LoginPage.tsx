import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '@/features/auth';
import {LoginPageView} from "@/features/auth/components/LoginPageView";



export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, error, isAuthenticated, clearError } = useAuth();

    const from = (location.state as { from?: string })?.from || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    return (
        <LoginPageView
           login={login}
           loading={loading}
         error={error}/>
    );
};
