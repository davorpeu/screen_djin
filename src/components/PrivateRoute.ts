/*
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PrivateRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.sessionId);

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;*/
