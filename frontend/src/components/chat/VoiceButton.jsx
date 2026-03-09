import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const VoiceButton = ({ onVoiceInput }) => {
    const { i18n, t } = useTranslation();
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.interimResults = false;
            
            // Map i18n language to SpeechRecognition lang
            const langMap = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'gu': 'gu-IN'
            };
            recog.lang = langMap[i18n.language] || 'en-US';

            recog.onstart = () => setIsListening(true);
            recog.onend = () => setIsListening(false);
            recog.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onVoiceInput(transcript);
            };
            recog.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            setRecognition(recog);
        }
    }, [i18n.language, onVoiceInput]);

    const toggleListen = () => {
        if (!recognition) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <div className="relative">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleListen}
                className={`relative p-3 rounded-full flex items-center justify-center transition-all ${isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
                    : 'bg-white text-gray-400 hover:text-agri-600 hover:bg-agri-50 dark:bg-gray-800 dark:hover:bg-agri-900/20 shadow-sm border border-gray-100 dark:border-gray-700'
                    }`}
                title={isListening ? t('listening') : t('click_to_speak')}
            >
                {isListening ? (
                    <MicOff size={20} className="relative z-10" />
                ) : (
                    <Mic size={20} className="relative z-10" />
                )}
                
                <AnimatePresence>
                    {isListening && (
                        <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.3 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 rounded-full bg-red-500"
                        />
                    )}
                </AnimatePresence>
            </motion.button>
            
            {isListening && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                    {t('listening')}...
                </div>
            )}
        </div>
    );
};
