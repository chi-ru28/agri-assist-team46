import { createContext, useContext, useState, useCallback } from "react";
import { chatAPI } from "../services/api";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const loadHistory = useCallback(async () => {
        try {
            const { data } = await chatAPI.getHistory();
            setMessages(data.map(m => ({ role: m.role, content: m.content })));
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    }, []);

    const sendMessage = useCallback(async (text) => {
        // Add user message immediately to UI
        setMessages(prev => [...prev, { role: "user", content: text }]);
        setIsTyping(true);

        try {
            const { data } = await chatAPI.send(text);
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch (err) {
            console.error("❌ API Error:", err.response?.data || err.message);
            // Show the REAL error in chat instead of generic message
            const errorMsg = err.response?.data?.detail || err.message || "Connection failed";
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `⚠️ Error: ${errorMsg} — Check if backend is running on port 8000.`
            }]);
        } finally {
            setIsTyping(false);
        }
    }, []);

    return (
        <ChatContext.Provider value={{ messages, isTyping, sendMessage, loadHistory }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);