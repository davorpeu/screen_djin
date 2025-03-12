// src/hooks/useAppDispatch.ts
import { useDispatch, useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/store';

// Export both hooks
export const useAppDispatch = () => useDispatch<RootState>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;