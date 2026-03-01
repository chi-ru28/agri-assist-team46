import { Sun, Moon, Globe, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ChatHeader = () => {
    const { user, toggleRole, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial dark mode preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm rounded-b-2xl mb-4 transition-colors">
            {/* Left: App Logo */}
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-agri-500 rounded-xl flex items-center justify-center shadow-lg shadow-agri-500/30">
                    <span className="text-white font-bold text-xl">🌱</span>
                </div>
                <span className="font-bold text-xl hidden sm:block text-gray-800 dark:text-gray-100">AgriAssist</span>
            </div>

            {/* Center: Page Title */}
            <div className="hidden md:flex flex-col items-center">
                <h1 className="font-semibold text-gray-800 dark:text-gray-100">AI Agriculture Assistant</h1>
                <span className="text-xs text-agri-600 dark:text-agri-400 font-medium bg-agri-50 dark:bg-agri-900/30 px-2 py-0.5 rounded-full">Online</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* User Role Badge */}
                <Link
                    to={`/${user?.role?.toLowerCase()}/profile`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-agri-100 dark:bg-agri-900/50 text-agri-700 dark:text-agri-300 text-sm font-medium hover:bg-agri-200 dark:hover:bg-agri-800/50 transition-colors"
                    title={`View ${user?.role} Profile`}
                >
                    {user?.role?.toLowerCase() === 'farmer' ? '👨‍🌾' : '🏪'}
                    <span className="hidden sm:inline">{user?.role}</span>
                </Link>

                {/* Language Selector */}
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Globe size={20} />
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Profile Dropdown (Simplified for demo) */}
                <div className="relative group">
                    <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <UserIcon size={20} />
                    </button>

                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-medium text-gray-800 dark:text-gray-100">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm flex items-center gap-2 rounded-b-xl transition-colors"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
