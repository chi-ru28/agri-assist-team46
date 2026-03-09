import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage on boot
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await api.auth.login(credentials);
            // Expected data: { user, tokens: { access: { token } } } based on backend

            const userData = data.user;
            const token = data.tokens?.access?.token;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);

            let errorMessage = 'Login failed. Please check your credentials.';
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                errorMessage = typeof detail === 'string' ? detail : detail[0]?.msg || errorMessage;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Frontend server or Backend server offline. Please run npm run dev and uvicorn.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const register = async (userData) => {
        try {
            const data = await api.auth.register(userData);

            const userResponse = data.user;
            const token = data.tokens?.access?.token;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userResponse));

            setUser(userResponse);
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);

            let errorMessage = 'Registration failed.';
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                // FastAPI validation errors return an array, HTTPExceptions return a string
                errorMessage = typeof detail === 'string' ? detail : detail[0]?.msg || errorMessage;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Backend connection refused. Make sure uvicorn and Vite are running.';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = async () => {
        try {
            // Optional backend logout call
            await api.auth.logout().catch(e => console.log('Backend logout ignored/failed', e));
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
