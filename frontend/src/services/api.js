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
            const response = await apiClient.post('/auth/logout');
            return response.data;
        }
    },
    chat: {
        getHistory: async () => {
            const response = await apiClient.get('/chat/history');
            return response; // Return response object to match ChatContext expectation
        },
        clearHistory: async () => {
            const response = await apiClient.delete('/chat/history');
            return response;
        },
        send: async (text) => {
            const response = await apiClient.post('/chat', { message: text });
            return response;
        },
        getReport: async () => {
            const response = await apiClient.get('/chat/report');
            return response.data;
        },
        analyzeImage: async (imageFile, text = '') => {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('message', text);
            const response = await apiClient.post('/chat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response;
        }
    },
    ai: {
        analyzeImage: async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await apiClient.post('/ai/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        predictFertilizer: async (data) => {
            const response = await apiClient.post('/ai/predict-fertilizer', data);
            return response.data;
        }
    }
};

export const authAPI = api.auth;
export const chatAPI = api.chat;
export const aiAPI = api.ai;

export default apiClient;
