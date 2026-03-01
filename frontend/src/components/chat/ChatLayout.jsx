import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { FarmerQuickActions } from '../dashboard/FarmerQuickActions';
import { ShopQuickActions } from '../dashboard/ShopQuickActions';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const ChatLayout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans selection:bg-agri-200 dark:selection:bg-agri-900 selection:text-agri-900 dark:selection:text-agri-100">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative max-w-7xl mx-auto w-full">
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden absolute top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300"
                >
                    <Menu size={20} />
                </button>

                <ChatHeader />

                <div className="flex-1 flex flex-row overflow-hidden relative">

                    <div className="flex-1 flex flex-col relative w-full h-full pb-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat bg-opacity-5">
                        <ChatMessages />
                        <ChatInput />
                    </div>

                    {/* Right Sidebar (Quick Actions) */}
                    <div className={`
            absolute lg:relative z-50 lg:z-auto h-full right-0
            w-72 lg:w-80 flex-shrink-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md lg:backdrop-blur-none
            border-l border-gray-200 dark:border-gray-800 p-4 lg:p-6 overflow-y-auto pt-16 lg:pt-6
            transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-500"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            {user?.role?.toLowerCase() === 'farmer' ? <FarmerQuickActions /> : <ShopQuickActions />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
