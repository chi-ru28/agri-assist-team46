import { chatAPI } from "../services/api";
import { useTranslation } from 'react-i18next';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const { i18n } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const loadHistory = useCallback(async () => {
        try {
            const { data } = await chatAPI.getHistory();
            setMessages(data.map(m => ({ role: m.role, content: m.content })));
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    }, []);

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;

        // Cancel any existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Map i18n language to Voice lang
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'gu': 'gu-IN'
        };
        utterance.lang = langMap[i18n.language] || 'en-US';
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [i18n.language]);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    const sendMessage = useCallback(async (text) => {
        stopSpeaking();
        // Add user message immediately to UI
        setMessages(prev => [...prev, { role: "user", content: text }]);
        setIsTyping(true);

        try {
            const { data } = await chatAPI.send(text);
            const reply = data.reply;
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
            
            // Auto-speak by default if requested
            speak(reply);
        } catch (err) {
            console.error("❌ API Error:", err.response?.data || err.message);
            // Show the REAL error in chat instead of generic message
            const errorMsg = err.response?.data?.detail || err.message || "Connection failed";
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `⚠️ Error: ${errorMsg} — Check if backend is running on port 8000.`
            }]);
            speak("I encountered an error connecting to the server.");
        } finally {
            setIsTyping(false);
        }
    }, [speak, stopSpeaking]);

    const sendImageMessage = useCallback(async (file) => {
        stopSpeaking();
        // Add optimistic user message
        setMessages(prev => [...prev, { role: "user", content: "📷 [Image Uploaded]" }]);
        setIsTyping(true);

        try {
            const { data } = await chatAPI.analyzeImage(file);
            const reply = data.reply;
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
            speak(reply);
        } catch (err) {
            console.error("❌ Image API Error:", err);
            setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error analyzing image." }]);
        } finally {
            setIsTyping(false);
        }
    }, [speak, stopSpeaking]);

    return (
        <ChatContext.Provider value={{ 
            messages, 
            isTyping, 
            isSpeaking, 
            sendMessage, 
            sendImageMessage, 
            loadHistory, 
            speak, 
            stopSpeaking 
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);