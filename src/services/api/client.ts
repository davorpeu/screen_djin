import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {API_KEY, API_URL} from '@/config';

export type ApiResponse<T> = {
    data: T;
    error: string | null;
    status: number;
};
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    params: {
        api_key: API_KEY
    },
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export const get = async <T>(url: string, params = {}): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.get<T>(url, { params });
        return {
            data: response.data,
            error: null,
            status: response.status
        };
    } catch (error: any) {
        return {
            data: {} as T,
            error: error.response?.data?.status_message || 'An error occurred',
            status: error.response?.status || 500
        };
    }
};

export const post = async <T>(url: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.post<T>(url, data, { params });
        return {
            data: response.data,
            error: null,
            status: response.status
        };
    } catch (error: any) {
        return {
            data: {} as T,
            error: error.response?.data?.status_message || 'An error occurred',
            status: error.response?.status || 500
        };
    }
};

export const put = async <T>(url: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.put<T>(url, data, { params });
        return {
            data: response.data,
            error: null,
            status: response.status
        };
    } catch (error: any) {
        return {
            data: {} as T,
            error: error.response?.data?.status_message || 'An error occurred',
            status: error.response?.status || 500
        };
    }
};

export const del = async <T>(url: string, params = {}): Promise<ApiResponse<T>> => {
    try {
        const response = await apiClient.delete<T>(url, { params });
        return {
            data: response.data,
            error: null,
            status: response.status
        };
    } catch (error: any) {
        return {
            data: {} as T,
            error: error.response?.data?.status_message || 'An error occurred',
            status: error.response?.status || 500
        };
    }
};

export default {
    get,
    post,
    put,
    delete: del
};