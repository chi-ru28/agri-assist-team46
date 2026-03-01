import axios from 'axios';

// Create a configured axios instance
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const api = {
    auth: {
        login: async (credentials) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        },
        register: async (userData) => {
            const response = await apiClient.post('/auth/register', userData);
            return response.data;
        },
        logout: async () => {
            // Optional: call backend logout endpoint here if implemented
            const response = await apiClient.post('/auth/logout');
            return response.data;
        }
    },
    chat: {
        sendMessage: async (message) => {
            const response = await apiClient.post('/chat', { message });
            return response.data;
        }
    }
};

export default apiClient;
