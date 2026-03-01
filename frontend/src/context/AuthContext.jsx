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
            // Returning error message dynamically based on backend layout
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please check your credentials.'
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
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed.'
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
