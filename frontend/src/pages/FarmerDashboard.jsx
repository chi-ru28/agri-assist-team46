import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { FarmerQuickActions } from '../components/dashboard/FarmerQuickActions';
import { Leaf, CloudSun, Activity, Droplets, Thermometer, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export const FarmerDashboard = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const stats = [
        { label: t('soil_health'), value: '85%', icon: <Activity className="text-agri-500" />, status: 'Optimal' },
        { label: t('moisture'), value: '42%', icon: <Droplets className="text-blue-500" />, status: 'Good' },
        { label: t('temperature'), value: '28°C', icon: <Thermometer className="text-orange-500" />, status: 'Normal' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
            <ChatSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <ChatHeader />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Hero Section */}
                        <div className="bg-gradient-to-br from-agri-600 to-agri-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h1 className="text-3xl font-bold mb-2">{t('welcome_back')}, {t('farmer')}!</h1>
                                <p className="text-agri-100 max-w-md">{t('dashboard_subtitle')}</p>
                            </div>
                            <Leaf className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            {stat.icon}
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                            {stat.status}
                                        </span>
                                    </div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</h3>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Weather Insights */}
                            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <CloudSun className="text-blue-500" /> {t('weather_insights')}
                                    </h2>
                                    <button className="text-sm text-agri-600 font-medium">{t('view_full_forecast')}</button>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold">32°C</div>
                                        <div className="text-gray-500 text-sm">Sunny</div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-4 gap-4 border-l border-gray-100 dark:border-gray-700 pl-8">
                                        {['Mon', 'Tue', 'Wed', 'Thu'].map((day) => (
                                            <div key={day} className="text-center">
                                                <div className="text-xs text-gray-400 mb-1">{day}</div>
                                                <CloudSun size={20} className="mx-auto text-yellow-500 mb-1" />
                                                <div className="text-sm font-medium">30°</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <ShieldCheck className="text-agri-600" /> {t('quick_actions')}
                                </h2>
                                <FarmerQuickActions />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
