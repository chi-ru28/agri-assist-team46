import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import i18n from '../i18n';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Sync i18n with preferred language
                if (parsedUser.preferred_language) {
                    i18n.changeLanguage(parsedUser.preferred_language);
                }
            } catch (err) {
                console.error("Failed to parse stored user:", err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const updateLanguage = async (newLang) => {
        try {
            await api.auth.updateLanguage(newLang);
            const updatedUser = { ...user, preferred_language: newLang };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            i18n.changeLanguage(newLang);
            return { success: true };
        } catch (error) {
            console.error("Language update failed:", error);
            // Still update local i18n for UI responsiveness
            i18n.changeLanguage(newLang);
            return { success: false, error: "Failed to sync language with server" };
        }
    };

    const login = async (credentials) => {
        try {
            const data = await api.auth.login(credentials);
            const userData = data.user;
            const token = data.tokens?.access?.token;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            if (userData.preferred_language) {
                i18n.changeLanguage(userData.preferred_language);
            }
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            let errorMessage = 'Login failed. Please check your credentials.';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.detail) {
                    errorMessage = typeof data.detail === 'string' ? data.detail : data.detail[0]?.msg || errorMessage;
                } else if (data.message) {
                    errorMessage = data.message;
                }
            }
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            const payload = { ...userData, language: i18n.language };
            const data = await api.auth.register(payload);

            const userResponse = data.user;
            const token = data.tokens?.access?.token;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userResponse));

            setUser(userResponse);
            if (userResponse.preferred_language) {
                i18n.changeLanguage(userResponse.preferred_language);
            }
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            let errorMessage = 'Registration failed.';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.detail) {
                    errorMessage = typeof data.detail === 'string' ? data.detail : data.detail[0]?.msg || errorMessage;
                } else if (data.message) {
                    errorMessage = data.message;
                }
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await api.auth.logout().catch(e => console.log('Backend logout ignored/failed', e));
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            i18n.changeLanguage('en'); // Reset to default on logout
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateLanguage }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
