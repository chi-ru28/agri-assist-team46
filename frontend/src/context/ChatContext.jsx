import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Set initial welcome message based on role
        if (user) {
            const welcomeText = user.role === 'Farmer'
                ? "Hello Farmer 👨‍🌾 How can I assist your crop today?"
                : "Hello Shop Owner 🏪 How can I help manage your inventory today?";

            setMessages([{
                id: 1,
                sender: 'ai',
                text: welcomeText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } else {
            setMessages([]);
        }
    }, [user]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            // Real API call to generative AI via backend
            const data = await api.chat.sendMessage(text);

            setIsTyping(false);
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.reply || 'Sorry, I could not process that response.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            setIsTyping(false);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: 'System Error: Unable to reach the AI assistant. Please check your connection.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    const sendImageMessage = async (file) => {
        if (!file) return;

        // Add user message indicating upload
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: `[Uploaded Image: ${file.name}] Can you analyze this crop image?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const data = await api.ai.analyzeImage(file);

            setIsTyping(false);
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: `Analysis Complete! 
Deficiency: ${data.deficiency}
Severity: ${data.severity}
Fertilizer Recommended: ${data.recommendation.fertilizer}
Dosage: ${data.recommendation.dosagePerAcre}
Precautions: ${data.recommendation.precautions}
Confidence: ${data.mlConfidence || data.healthScore}%`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            setIsTyping(false);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: 'System Error: Unable to process the image. Please make sure the ML service is running.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, isTyping, sendMessage, sendImageMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
