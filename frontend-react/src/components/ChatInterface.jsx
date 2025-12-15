import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronRight, Menu, Heart } from 'lucide-react';
import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import '../styles/Chat.css';

const ChatInterface = ({
    messages,
    onSendMessage,
    loading,
    chats = [],
    activeChatId,
    onNewChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
    user
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState(''); // Lifted state for consistency

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, loading]);

    return (
        <div className="chat-layout">

            <ChatSidebar
                chats={chats}
                activeChatId={activeChatId}
                onNewChat={onNewChat}
                onSelectChat={(id) => {
                    onSelectChat(id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                onRenameChat={onRenameChat}
                onDeleteChat={onDeleteChat}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
            />

            {/* Main Chat Area */}
            <main className="chat-main">

                {/* Mobile Header / Toggle */}
                <div className="hide-on-desktop absolute top-4 left-4 z-20">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="mobile-toggle"
                    >
                        <Menu size={20} className="text-secondary" />
                    </button>
                </div>

                {/* Desktop Toggle (when closed) */}
                {!isSidebarOpen && (
                    <div className="hide-on-mobile absolute top-1/2 -left-3 z-20">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="toggle-btn"
                            title="Open Sidebar"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Messages Container */}
                <div className="messages-container">
                    <div className="messages-wrapper">
                        {messages.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon-box">
                                    <Sparkles size={40} />
                                </div>
                                <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                                    Welcome Back, {user?.name?.split(' ')[0] || 'Friend'}
                                </h1>
                                <p className="text-secondary mb-12 max-w-lg text-lg font-medium leading-relaxed mx-auto">
                                    I'm here to support your journey. Ask me anything about diet, wellness, or baby care.
                                </p>

                                <div className="suggestion-grid mx-auto">
                                    {[
                                        { icon: "🥗", text: "Healthy snacks for hydration" },
                                        { icon: "🧘‍♀️", text: "Safe yoga poses for third trimester" },
                                        { icon: "💤", text: "Tips for better sleep" },
                                        { icon: "👜", text: "What to pack for the hospital" }
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onSendMessage(item.text)}
                                            className="suggestion-card"
                                        >
                                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                            <span className="font-semibold text-secondary">{item.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 sm:gap-8 pb-4">
                                {messages.map((msg, idx) => (
                                    <ChatMessage key={idx} message={msg} />
                                ))}

                                {loading && (
                                    <div className="message-row bot fade-in">
                                        <div className="message-avatar bot">
                                            <Sparkles size={18} className="text-secondary-400" />
                                        </div>
                                        <div className="message-bubble bot" style={{ padding: '0.75rem 1rem' }}>
                                            <div className="typing-indicator">
                                                <span className="typing-dot"></span>
                                                <span className="typing-dot"></span>
                                                <span className="typing-dot"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} style={{ height: '1px' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Input */}
                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSendMessage={onSendMessage}
                    loading={loading}
                />
            </main>
        </div>
    );
};

export default ChatInterface;
