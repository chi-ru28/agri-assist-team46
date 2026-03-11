import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const VoiceButton = ({ onVoiceInput }) => {
    const [isListening, setIsListening] = useState(false);

    const toggleListen = () => {
        setIsListening(prev => !prev);
        if (!isListening) {
            // Simulate listening Start
            setTimeout(() => {
                setIsListening(false);
                onVoiceInput("Simulated voice input...");
            }, 3000);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleListen}
            className={`relative p-3 rounded-full flex items-center justify-center transition-all ${isListening
                ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
                : 'bg-white text-gray-400 hover:text-agri-600 hover:bg-agri-50 dark:bg-gray-800 dark:hover:bg-agri-900/20'
                }`}
            title={isListening ? "Listening..." : "Click to speak"}
        >
            {isListening ? (
                <>
                    <span className="absolute w-full h-full rounded-full border-2 border-red-500 animate-ping opacity-50"></span>
                    <MicOff size={20} className="relative z-10" />
                </>
            ) : (
                <Mic size={20} className="relative z-10" />
            )}
        </motion.button>
    );
};
