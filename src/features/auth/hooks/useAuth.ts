import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {clearAuthError, login, logout, restoreSession} from '../stores/authSlice';
import {LoginCredentials} from '../types';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    const loginUser = useCallback(
        (credentials: LoginCredentials) => {
            return dispatch(login(credentials));
        },
        [dispatch]
    );

    const logoutUser = useCallback(() => {
        return dispatch(logout());
    }, [dispatch]);

    const restoreUserSession = useCallback(
        (sessionId: string) => {
            return dispatch(restoreSession(sessionId));
        },
        [dispatch]
    );

    const clearError = useCallback(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    return {
        user: auth.user,
        sessionId: auth.sessionId,
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        error: auth.error,
        login: loginUser,
        logout: logoutUser,
        restoreSession: restoreUserSession,
        clearError
    };
};