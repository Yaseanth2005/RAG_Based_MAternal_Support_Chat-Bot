import React, { useState } from 'react';
import { Plus, MessageSquare, Edit2, Trash2, X, Check, Search, ChevronLeft, PanelLeftClose } from 'lucide-react';
import '../styles/Chat.css';

const ChatSidebar = ({
    chats = [],
    activeChatId,
    onNewChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
    isOpen,
    onClose,
    user
}) => {
    const [editingChatId, setEditingChatId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const startEditing = (e, chat) => {
        e.stopPropagation();
        setEditingChatId(chat.id);
        setEditTitle(chat.title);
    };

    const saveEditing = async (e, chatId) => {
        e.stopPropagation();
        if (editTitle.trim()) {
            await onRenameChat(chatId, editTitle);
        }
        setEditingChatId(null);
    };

    const filteredChats = chats.filter(chat =>
        (chat.title || 'New Chat').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div
                className={`mobile-overlay hide-on-desktop ${isOpen ? 'block' : 'hidden'}`}
                onClick={onClose}
            />

            <aside className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chat-sidebar-header">
                    <div className="flex items-center gap-6">
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            <MessageSquare size={16} fill="currentColor" />
                        </div>
                        <h2 className="font-bold text-lg dark:text-white">History</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="icon-btn"
                        title="Close Sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                <div className="p-4">
                    <button onClick={onNewChat} className="new-chat-btn">
                        <Plus size={18} />
                        <span>New Conversation</span>
                    </button>
                </div>

                <div className="search-wrapper">
                    <Search size={14} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sidebar-search"
                    />
                </div>

                <div className="chat-list">
                    {filteredChats.length === 0 ? (
                        <div className="text-center py-10 px-6 text-sm text-tertiary">
                            <p>No conversations found</p>
                        </div>
                    ) : (
                        filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id)}
                                className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
                            >
                                {editingChatId === chat.id ? (
                                    <div className="flex items-center w-full gap-2" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            className="rename-input"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEditing(e, chat.id);
                                                if (e.key === 'Escape') setEditingChatId(null);
                                            }}
                                        />
                                        <button onClick={(e) => saveEditing(e, chat.id)} className="icon-btn icon-btn-sm text-primary">
                                            <Check size={14} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingChatId(null); }} className="icon-btn icon-btn-sm icon-btn-danger">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <MessageSquare
                                            size={18}
                                            className={`shrink-0 ${chat.id === activeChatId ? 'text-primary' : 'text-tertiary'}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="chat-item-title">{chat.title || 'New Conversation'}</div>
                                            <div className="chat-item-date">
                                                {new Date(chat.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="chat-actions">
                                            <button
                                                onClick={(e) => startEditing(e, chat)}
                                                className="icon-btn icon-btn-sm"
                                                title="Rename"
                                            >
                                                <Edit2 size={13} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                                                className="icon-btn icon-btn-sm icon-btn-danger"
                                                title="Delete"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="user-profile">
                    <div className="avatar">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate dark:text-white">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-tertiary truncate">
                            {user?.email || 'Premium Member'}
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default ChatSidebar;
