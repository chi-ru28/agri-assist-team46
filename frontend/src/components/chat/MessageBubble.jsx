import { motion } from 'framer-motion';

export const MessageBubble = ({ message }) => {
    const isAI = message.sender === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm
          ${isAI ? 'bg-agri-100 text-agri-600 dark:bg-agri-900 dark:text-agri-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
        `}>
                    {isAI ? '🤖' : '👤'}
                </div>

                {/* Message Bubble Container */}
                <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                    <div
                        className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative
              ${isAI
                                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                : 'bg-gradient-to-br from-agri-500 to-agri-600 text-white rounded-tr-none'
                            }
            `}
                    >
                        {message.text}
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 px-1">
                        {message.timestamp}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
