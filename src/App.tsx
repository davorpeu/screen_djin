import React, {useEffect} from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Router } from './router';
import {useAppDispatch, useAppSelector} from "./hooks";
import {restoreSession} from "./store/slices/authSlice";

function App() {
    const dispatch = useAppDispatch();
    const sessionId = useAppSelector(state => state.auth.sessionId);
    useEffect(() => {
        const savedSession = localStorage.getItem('tmdbSession');
        if (savedSession && !sessionId) {
            dispatch(restoreSession(savedSession));
        }
    }, [dispatch, sessionId]);
    return (
        <div style={{
            height: '100vh',
            width: '100%',
            backgroundColor: '#f0f0f0' // Added for visibility
        }}>
        <Provider store={store}>
            <Router />
        </Provider>
            </div>
    );
}

export default App;