import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, User, Copy, Check, FileText } from 'lucide-react';
import '../styles/Chat.css';

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
            {/* Avatar */}
            <div className={`message-avatar ${isUser ? 'user' : 'bot'}`}>
                {isUser ? <User size={18} /> : <Sparkles size={18} className="fill-current" />}
            </div>

            {/* Content */}
            <div className="message-content">
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">
                        {isUser ? 'You' : 'Assistant'}
                    </span>
                </div>

                <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
                    {/* Copy Button */}
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className="icon-btn icon-btn-sm"
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                opacity: 0.6
                            }}
                            title="Copy message"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    )}

                    <div className="prose">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {/* Sources */}
                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-slate-700">
                            <p className="text-xs font-semibold text-tertiary mb-2 flex items-center gap-1">
                                <span>📚</span> References
                            </p>
                            <div className="source-grid">
                                {message.sources.map((source, idx) => (
                                    <div
                                        key={idx}
                                        className="source-card"
                                        title={source.content}
                                    >
                                        <div className="source-card-header">
                                            <FileText size={12} className="text-primary-500" />
                                            <span>Source {idx + 1}</span>
                                        </div>
                                        <div className="source-card-title">
                                            {source.source_file}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
