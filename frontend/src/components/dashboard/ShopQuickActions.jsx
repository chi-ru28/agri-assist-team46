import { PlusCircle, Container, Activity, Link2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const ShopQuickActions = () => {
    const { sendMessage } = useChat();

    const actions = [
        { label: 'Add Product', icon: <PlusCircle size={18} className="text-agri-600 dark:text-agri-400" />, query: 'I want to add a new product to my inventory.' },
        { label: 'Check Stock', icon: <Container size={18} className="text-blue-500" />, query: 'Show me my current stock levels.' },
        { label: 'View Demand', icon: <Activity size={18} className="text-orange-500" />, query: 'What is the current demand for agricultural products?' },
        { label: 'Connect Shops', icon: <Link2 size={18} className="text-purple-500" />, query: 'How can I connect with other shops?' },
    ];

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Shop Actions</h3>
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => sendMessage(action.query)}
                    className="flex items-center gap-3 p-3 lg:p-4 rounded-2xl bg-white hover:bg-agri-50 dark:bg-gray-800 dark:hover:bg-gray-700/80 transition-all border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md group text-left w-full"
                >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:bg-white dark:group-hover:bg-gray-800 flex items-center justify-center transition-colors shadow-sm">
                        {action.icon}
                    </div>
                    <span className="font-medium text-[15px] text-gray-700 dark:text-gray-200 group-hover:text-agri-700 dark:group-hover:text-agri-400 transition-colors">{action.label}</span>
                </button>
            ))}
        </div>
    );
};
