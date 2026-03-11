import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { Package, Plus, Search, Tag, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { api } from '../services/api';

export const InventoryManager = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [products, setProducts] = useState([
        { id: '1', name: 'Urea Fertilizer', category: 'Fertilizer', price: 450, stock: 24, isAvailable: true, tag: 'Chemical' },
        { id: '2', name: 'Organic Compost', category: 'Organic', price: 320, stock: 15, isAvailable: true, tag: 'Organic' },
        { id: '3', name: 'Pesticide Sprayer', category: 'Tools', price: 850, stock: 8, isAvailable: false, tag: 'Tool' },
    ]);

    const stats = [
        { label: t('total_items'), value: products.length, icon: <Package size={20} className="text-agri-600" /> },
        { label: t('low_stock'), value: products.filter(p => p.stock < 10).length, icon: <Activity size={20} className="text-orange-500" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
            <ChatSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <ChatHeader />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('inventory_management')}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{t('manage_stock_desc')}</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-agri-600/20">
                                <Plus size={18} /> {t('add_new_product')}
                            </button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">{stat.icon}</div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</p>
                                        <p className="text-xl font-bold dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Filter Bar */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={t('search_products')}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-agri-500 outline-none"
                                />
                            </div>
                            <select className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-agri-500 outline-none min-w-[150px]">
                                <option value="all">{t('all_categories')}</option>
                                <option value="fertilizer">{t('fertilizer')}</option>
                                <option value="tools">{t('tools')}</option>
                            </select>
                        </div>

                        {/* Inventory Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm uppercase">
                                        <th className="px-6 py-4 font-semibold">{t('product_details')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('category')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('stock')}</th>
                                        <th className="px-6 py-4 font-semibold">{t('status')}</th>
                                        <th className="px-6 py-4 font-semibold text-right">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 dark:text-white">{product.name}</span>
                                                    <span className="text-xs text-gray-500">ID: {product.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.tag === 'Organic'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                                                    }`}>
                                                    {product.tag}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{product.stock}</td>
                                            <td className="px-6 py-4">
                                                {product.isAvailable ? (
                                                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                        <CheckCircle2 size={16} /> {t('in_stock')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                                        <XCircle size={16} /> {t('out_of_stock')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                                    <MoreVertical size={18} className="text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
