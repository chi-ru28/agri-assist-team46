import { motion } from 'framer-motion';

export const MessageBubble = ({ message }) => {
    const isAI = message.sender === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full py-6 px-4 md:px-6 lg:px-12 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors`}
        >
            <div className={`flex w-full max-w-4xl mx-auto gap-4 md:gap-6`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm text-sm
          ${isAI ? 'bg-gradient-to-br from-agri-400 to-agri-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
        `}>
                    {isAI ? '✨' : '👤'}
                </div>

                {/* Message Content Container */}
                <div className={`flex flex-col w-full min-w-0 pt-1`}>
                    <div className="font-semibold text-[13px] text-gray-800 dark:text-gray-200 mb-1">
                        {isAI ? 'AgriAssist' : 'You'} <span className="text-[11px] text-gray-400 dark:text-gray-500 font-normal ml-2">{message.timestamp}</span>
                    </div>

                    {/* Image Attachment Preview */}
                    {message.file && (
                        <div className="mb-4 rounded-xl overflow-hidden max-w-sm border border-gray-200 dark:border-gray-700">
                            <img src={message.file} alt="Uploaded" className="w-full h-auto object-cover" />
                        </div>
                    )}

                    {/* Text content */}
                    <div className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                        {message.text}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
