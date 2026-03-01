import { useState, useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { VoiceButton } from './VoiceButton';

export const ChatInput = () => {
    const [input, setInput] = useState('');
    const { sendMessage } = useChat();
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate image upload processing
            sendMessage(`[Uploaded Image: ${file.name}] What can you tell me about this?`);
        }
    };

    return (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-gray-900 dark:via-gray-900 pb-4 pt-10 px-4">
            <div className="max-w-4xl mx-auto flex items-end gap-2 bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700">

                {/* Advanced Upload Items */}
                <div className="flex gap-1 pb-1 pl-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-gray-400 hover:text-agri-600 hover:bg-agri-50 dark:hover:bg-agri-900/20 rounded-full transition-colors flex-shrink-0"
                        title="Upload Image"
                    >
                        <ImageIcon size={20} />
                    </button>

                    <VoiceButton onVoiceInput={(text) => setInput(text)} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="flex-1 flex items-center pr-1 h-14">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full h-full bg-transparent px-2 md:px-4 text-[15px] outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="ml-2 w-10 h-10 md:w-12 md:h-12 bg-agri-500 hover:bg-agri-600 active:scale-95 disabled:opacity-50 disabled:hover:bg-agri-500 disabled:active:scale-100 text-white rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-md shadow-agri-500/30"
                    >
                        <Send size={18} className="translate-x-[1px]" />
                    </button>
                </form>
            </div>
        </div>
    );
};
