import { MessageSquare, Plus, PanelLeftClose, PanelLeft, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export const ChatSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user } = useAuth();
    const [recentChats, setRecentChats] = useState([
        { id: 1, title: 'Crop Health Diagnosis', date: 'Today' },
        { id: 2, title: 'Fertilizer Advice for Wheat', date: 'Yesterday' },
        { id: 3, title: 'Weather based Irrigation', date: 'Previous 7 Days' }
    ]);

    // Note: In a fully connected app, this would map directly to categorized chat session titles 
    // from the backend. For now, it provides the robust Gemini UI structure.

    if (!isSidebarOpen) {
        return (
            <div className="hidden lg:flex flex-col items-center py-4 w-16 bg-gray-50/50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all z-10">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors" title="Expand menu">
                    <PanelLeft size={20} />
                </button>
                <div className="mt-4 flex flex-col gap-4">
                    <button className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors" title="New chat">
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`
            absolute lg:relative z-40 h-full left-0
            w-72 flex-shrink-0 bg-gray-50 dark:bg-gray-900
            border-r border-gray-200 dark:border-gray-800 flex flex-col
            transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="p-3">
                <button onClick={() => setIsSidebarOpen(false)} className="hidden lg:flex p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors w-max" title="Collapse menu">
                    <PanelLeftClose size={20} />
                </button>
            </div>

            <div className="px-3 pb-4">
                <button className="flex items-center gap-3 w-max px-4 py-2.5 rounded-full bg-gray-200/50 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors text-[14px] font-medium border border-transparent">
                    <Plus size={18} />
                    New chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 mt-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <div className="space-y-1">
                    <div className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Recent</div>
                    {recentChats.map(chat => (
                        <button key={chat.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 text-[14px] truncate flex items-center gap-3 transition-colors">
                            <MessageSquare size={16} className="flex-shrink-0 opacity-70" />
                            <span className="truncate">{chat.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3 space-y-1 border-t border-gray-200 dark:border-gray-800">
                <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 text-[14px] flex items-center gap-3 transition-colors">
                    <HelpCircle size={18} className="opacity-70" />
                    Help
                </button>
                <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 text-[14px] flex items-center gap-3 transition-colors">
                    <Settings size={18} className="opacity-70" />
                    Settings
                </button>
            </div>
        </div>
    );
};
