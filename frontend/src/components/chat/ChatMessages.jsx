import { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageBubble } from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatMessages = () => {
    const { messages, isTyping } = useChat();
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 scroll-smooth space-y-4">
            <AnimatePresence>
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-start gap-3 w-max"
                    >
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-agri-100 dark:bg-agri-900 shadow-sm text-agri-600 dark:text-agri-300">
                            🤖
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 h-[46px]">
                            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={endOfMessagesRef} />
        </div>
    );
};
