import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store/store';

interface AppProviderProps {
    children: React.ReactNode;
}