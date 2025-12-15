import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import '../styles/Chat.css';

const ChatInput = ({ input, setInput, onSendMessage, loading }) => {
    const textareaRef = useRef(null);

    // Auto-resize
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        onSendMessage(input);
        setInput(''); // Clear input after sending
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    return (
        <div className="input-container">
            <div className={`chat-input-box ${loading ? 'opacity-80' : ''}`}>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Asking about pregnancy diet, exercises..."
                    className="chat-textarea"
                    rows={1}
                    disabled={loading}
                />

                <div className="flex gap-2 pb-0.5">
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || loading}
                        className={`send-btn ${input.trim() ? 'active' : ''}`}
                    >
                        <Send size={20} className={input.trim() ? 'ml-0.5' : ''} />
                    </button>
                </div>
            </div>

            <p className="text-center text-xs font-medium text-tertiary mt-3 opacity-60">
                MaternalCare can make mistakes. Please verify important medical information.
            </p>
        </div>
    );
};

export default ChatInput;
