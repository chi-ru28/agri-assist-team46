import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Box, Activity } from 'lucide-react';

export const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const isFarmer = user.role.toLowerCase() === 'farmer';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/chat')}
                        className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    {/* Cover */}
                    <div className={`h-32 sm:h-48 w-full ${isFarmer ? 'bg-gradient-to-r from-agri-400 to-agri-600' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`}></div>

                    <div className="px-6 pb-8 sm:px-10">
                        {/* Avatar section */}
                        <div className="relative flex justify-between items-start -mt-12 sm:-mt-16 mb-6">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                                <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl sm:text-5xl ${isFarmer ? 'bg-agri-100' : 'bg-blue-100'}`}>
                                    {isFarmer ? '👨‍🌾' : '🏪'}
                                </div>
                            </div>
                            <div className="mt-14 sm:mt-18">
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/80 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {user.name}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                {isFarmer ? 'Master Farmer' : 'Agricultural Vendor'}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500"><Phone size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500"><MapPin size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">Punjab, India</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500"><Mail size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200">{user.name.split(' ')[0].toLowerCase()}@example.com</p>
                                </div>
                            </div>

                            {isFarmer ? (
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500"><Activity size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Crop Focus</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">Wheat & Corn</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-500"><Box size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Inventory Status</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">85% Stocked</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};
