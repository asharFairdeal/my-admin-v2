import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import apiUrls from './apiUrls';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || apiUrls.baseUrl 

// Create an instance of axios for routes that require a token
const apiWithToken: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Request interceptor for API calls
apiWithToken.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('_t');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Create an instance of axios for routes that don't require a token
const apiWithoutToken: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Response interceptor to handle errors
apiWithToken.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error with token', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

apiWithoutToken.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error without token', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const apiService = {
    get: (url: string, params?: { [key: string]: string | number | boolean }, requiresToken = true) =>
        (requiresToken ? apiWithToken : apiWithoutToken).get(url, { params }),
    post: (url: string, body: { [key: string]: string | number | boolean }, requiresToken = true, isFormData = false) => {
        const config: AxiosRequestConfig = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        return (requiresToken ? apiWithToken : apiWithoutToken).post(url, body, config);
    },
    put: (url: string, body: { [key: string]: string | number | boolean }, requiresToken = true, isFormData = false) => {
        const config: AxiosRequestConfig = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        return (requiresToken ? apiWithToken : apiWithoutToken).put(url, body, config);
    },
    delete: (url: string, requiresToken = true) =>
        (requiresToken ? apiWithToken : apiWithoutToken).delete(url),
};

export default apiService;
