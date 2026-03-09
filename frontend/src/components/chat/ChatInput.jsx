import { ShopQuickActions } from '../dashboard/ShopQuickActions';
import { useTranslation } from 'react-i18next';

export const ChatInput = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const { sendMessage, sendImageMessage } = useChat();
    const fileInputRef = useRef(null);
    const [showActions, setShowActions] = useState(false);
    const { user } = useAuth();
    const popupRef = useRef(null);

    // Close popup on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowActions(false);
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            sendImageMessage(file);
        }
    };

    return (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 pb-4 pt-12 px-4 md:px-6 z-10">
            {/* Quick Actions Popup */}
            {showActions && (
                <div ref={popupRef} className="absolute bottom-[80px] left-4 md:left-auto md:right-4 w-[calc(100%-2rem)] md:max-w-[340px] bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 p-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <Zap size={16} className="text-agri-500" />
                            {t('quick_actions')}
                        </h3>
                        <button onClick={() => setShowActions(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-full">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                        {user?.role?.toLowerCase() === 'farmer' ? (
                            <FarmerQuickActions onItemClick={() => setShowActions(false)} />
                        ) : (
                            <ShopQuickActions onItemClick={() => setShowActions(false)} />
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto flex items-end gap-2 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-md p-1.5 md:p-2 rounded-3xl border border-gray-200 dark:border-gray-700 focus-within:ring-1 focus-within:ring-agri-500/50 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all shadow-sm">

                {/* Advanced Upload Items */}
                <div className="flex gap-1 pb-1 pl-1 md:pl-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*,video/*"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 md:p-3 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 rounded-full transition-colors flex-shrink-0"
                        title="Upload Image/Video"
                    >
                        <ImageIcon size={20} />
                    </button>

                    <VoiceButton onVoiceInput={(text) => setInput(text)} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="flex-1 flex items-center pr-1 h-[52px]">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chat_placeholder')}
                        rows={1}
                        className="w-full h-full bg-transparent px-2 md:px-3 py-3.5 text-[15px] outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none overflow-hidden block"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="ml-2 w-10 h-10 md:w-11 md:h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 active:scale-95 disabled:opacity-30 disabled:hover:bg-black disabled:dark:hover:bg-white disabled:active:scale-100 text-white rounded-full flex items-center justify-center transition-all flex-shrink-0"
                    >
                        <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
                    </button>
                </form>
            </div>
            <div className="max-w-4xl mx-auto text-center mt-3">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{t('mistake_disclaimer')}</p>
            </div>
        </div>
    );
};
