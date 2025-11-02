import React, { useEffect, useRef, useState } from 'react';

// Simple chat page using only React + CSS classes defined in App.css
const HomePagePlain = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setStatus('ready');
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }
    };
    checkHealth();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      setLoading(true);
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, top_k: 3 }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        const errMsg = data.error || 'Server error';
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Error: ${errMsg}`,
            timestamp: Date.now(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer || '',
            sources: data.sources || [],
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Network error: ${err.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      {/* Chat area */}
      <div className="main-content">
        <div className="chat-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">🤱</div>
              <h2>Welcome to Maternal Care AI</h2>
              <p>
                I provide caring, evidence-based guidance during your pregnancy journey. Ask about prenatal care,
                nutrition, or your baby's development.
              </p>
              <div className="example-questions">
                <div className="example-title">Try asking</div>
                {[ 
                  'What prenatal vitamins should I take?',
                  'How can I manage morning sickness?',
                  'What foods should I avoid during pregnancy?',
                ].map((q) => (
                  <button
                    key={q}
                    className="example-btn"
                    onClick={() => {
                      setInput(q);
                      inputRef.current?.focus();
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.role === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-header">
                <div className={`message-avatar ${m.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
                  {m.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-name">{m.role === 'user' ? 'You' : 'Maternal Care AI'}</div>
              </div>
              <div className="message-content">{m.content}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="sources">
                  <div className="sources-title">Sources</div>
                  <div className="sources-chips">
                    {m.sources.map((s, i) => (
                      <div key={i} className="source-chip" title={s.source_file}>
                        <span className="source-name">{s.source_file}</span>
                        <span className="source-score">{Math.round((s.score || 0) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="loading">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask me anything about your pregnancy journey..."
                rows={1}
              />
              <button className="send-btn" type="submit" disabled={!input.trim() || loading}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12L20 4L12 20L11 13L4 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="input-footer">
              <div />
              <div>Press Enter to send, Shift+Enter for new line</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePagePlain;
