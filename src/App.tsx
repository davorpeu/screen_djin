// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Router } from './router';

function App() {
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