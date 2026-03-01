import { ChatLayout } from '../components/chat/ChatLayout';
import { ChatProvider } from '../context/ChatContext';

export const ChatPage = () => {
    return (
        <ChatProvider>
            <ChatLayout />
        </ChatProvider>
    );
};
