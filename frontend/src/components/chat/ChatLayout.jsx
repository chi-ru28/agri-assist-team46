import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import { FarmerQuickActions } from '../dashboard/FarmerQuickActions';
import { ShopQuickActions } from '../dashboard/ShopQuickActions';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, AppWindow } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import { Download } from 'lucide-react';

export const ChatLayout = () => {
    const { user } = useAuth();
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { generateReport, report } = useChat();

    const handleQuickAction = useCallback(async (type) => {
        if (type === 'report') {
            await generateReport();
            setShowReportModal(true);
        }
        setIsRightSidebarOpen(false);
    }, [generateReport]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans selection:bg-agri-200 dark:selection:bg-agri-900 selection:text-agri-900 dark:selection:text-agri-100">

            {/* Mobile Left Sidebar Overlay */}
            {isLeftSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsLeftSidebarOpen(false)}
                />
            )}

            {/* Mobile Right Sidebar Overlay */}
            {isRightSidebarOpen && (
                <div
                    className="2xl:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsRightSidebarOpen(false)}
                />
            )}

            {/* Left Chat History Sidebar */}
            <ChatSidebar isSidebarOpen={isLeftSidebarOpen} setIsSidebarOpen={setIsLeftSidebarOpen} />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative w-full translate-x-0 transition-transform bg-white dark:bg-gray-900">
                {/* Mobile menu buttons */}
                <div className="absolute top-3 left-3 z-20 flex gap-2 lg:hidden">
                    {!isLeftSidebarOpen && (
                        <button
                            onClick={() => setIsLeftSidebarOpen(true)}
                            className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                </div>

                <div className="absolute top-3 right-3 z-20 flex gap-2 2xl:hidden">
                    {!isRightSidebarOpen && (
                        <button
                            onClick={() => setIsRightSidebarOpen(true)}
                            className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 md:opacity-50 md:hover:opacity-100 transition-opacity"
                            title="Quick Actions"
                        >
                            <AppWindow size={20} />
                        </button>
                    )}
                </div>

                <ChatHeader />

                <div className="flex-1 flex flex-row overflow-hidden relative">

                    <div className="flex-1 flex flex-col relative w-full h-full pb-0 bg-white dark:bg-gray-900">
                        <ChatMessages />
                        <ChatInput />
                    </div>

                    {/* Right Sidebar (Quick Actions) */}
                    <div className={`
            absolute 2xl:relative z-50 2xl:z-10 h-full right-0
            w-72 flex-shrink-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md 2xl:backdrop-blur-none
            border-l border-gray-200 dark:border-gray-800 p-4 lg:p-6 overflow-y-auto pt-16 lg:pt-6
            transform transition-transform duration-300 ease-in-out shadow-2xl 2xl:shadow-none
            ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full 2xl:translate-x-0'}
            2xl:block ${!isRightSidebarOpen && 'hidden'}
          `}>
                        <button
                            onClick={() => setIsRightSidebarOpen(false)}
                            className="2xl:hidden absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-500"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            {user?.role?.toLowerCase() === 'farmer' ? (
                                <FarmerQuickActions onItemClick={handleQuickAction} />
                            ) : (
                                <ShopQuickActions onItemClick={() => setIsRightSidebarOpen(false)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && report && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AgriAssist Chat Report</h2>
                            <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-sans">{report.content}</pre>
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    const blob = new Blob([report.content], { type: 'text/markdown' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${report.title}.md`;
                                    a.click();
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-agri-600 hover:bg-agri-700 text-white rounded-full font-medium transition-colors"
                            >
                                <Download size={18} /> Download Markdown
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
