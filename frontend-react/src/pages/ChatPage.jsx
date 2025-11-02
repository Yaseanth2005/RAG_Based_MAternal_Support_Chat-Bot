import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createChat, listChats, listMessages, deleteChat, renameChat } from '../api/chat';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(chatId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [controller, setController] = useState(null);
  const [sources, setSources] = useState([]);
  const [streamReady, setStreamReady] = useState(false);
  const [gotChunk, setGotChunk] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const streamTimerRef = useRef(null);
  const streamSecondaryTimerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Render markdown-lite: paragraphs and bullet lists while streaming
  const renderContent = (text) => {
    const lines = (text || '').split('\n');
    const blocks = [];
    let list = [];
    const flushList = () => {
      if (list.length) {
        blocks.push(
          <ul key={`ul-${blocks.length}`} style={{ margin: '6px 0 6px 22px' }}>
            {list.map((li, i) => <li key={i} style={{ lineHeight: 1.6 }}>{li}</li>)}
          </ul>
        );
        list = [];
      }
    };
    lines.forEach((raw) => {
      const l = raw.trimEnd();
      if (/^(\-|\*|•)\s+/.test(l)) {
        list.push(l.replace(/^(\-|\*|•)\s+/, ''));
      } else if (/^#{1,3}\s+/.test(l)) {
        flushList();
        const heading = l.replace(/^#{1,3}\s+/, '');
        blocks.push(<div key={`h-${blocks.length}`} style={{ fontWeight: 700, margin: '8px 0 4px' }}>{heading}</div>);
      } else if (l === '') {
        flushList();
        blocks.push(<div key={`sp-${blocks.length}`} style={{ height: 6 }} />);
      } else {
        flushList();
        blocks.push(<p key={`p-${blocks.length}`} style={{ margin: '6px 0', lineHeight: 1.7 }}>{l}</p>);
      }
    });
    flushList();
    return blocks;
  };

  useEffect(() => {
    // Track whether user is near bottom; if scrolled up, disable auto-scroll
    const el = chatContainerRef.current;
    if (el) {
      const onScroll = () => {
        const threshold = 40; // px from bottom
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
        setAutoScroll(atBottom);
      };
      el.addEventListener('scroll', onScroll, { passive: true });
      // Initialize state
      onScroll();
      return () => el.removeEventListener('scroll', onScroll);
    }
  }, [chatContainerRef.current]);

  useEffect(() => {
    // When messages change and user wants auto-scroll, keep pinned to bottom
    if (autoScroll) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const loadChats = async () => {
      setLoadingChats(true);
      try {
        const data = await listChats();
        setChats(data);
        if (!activeChatId && data.length) {
          setActiveChatId(data[0].id);
          navigate(`/chat/${data[0].id}`, { replace: true });
        }
      } catch (e) {
        // ignore for now
      } finally {
        setLoadingChats(false);
      }
    };
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatId && chatId !== activeChatId) {
      setActiveChatId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChatId) return;
      try {
        const data = await listMessages(activeChatId);
        setMessages(data);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
      } catch (e) {
        setMessages([]);
      }
    };
    loadMessages();
  }, [activeChatId]);

  const onNewChat = async () => {
    try {
      const data = await createChat('New Chat');
      setChats(prev => [{ id: data.id, title: data.title }, ...prev]);
      setMessages([]);
      setActiveChatId(data.id);
      navigate(`/chat/${data.id}`);
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (e) {}
  };

  const onRenameChat = async (id) => {
    const title = prompt('Rename chat to:');
    if (!title) return;
    try {
      await renameChat(id, title);
      setChats(prev => prev.map(c => c.id === id ? { ...c, title } : c));
    } catch (e) {}
  };

  const onDeleteChat = async (id) => {
    if (!confirm('Delete this chat?')) return;
    try {
      await deleteChat(id);
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
        if (chats.length > 1) {
          const next = chats.find(c => c.id !== id);
          if (next) navigate(`/chat/${next.id}`);
        } else {
          navigate('/chat');
        }
        setMessages([]);
      }
    } catch (e) {}
  };

  const onSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    // Ensure a chat exists
    let currentChatId = activeChatId;
    if (!currentChatId) {
      try {
        const data = await createChat('New Chat');
        setChats(prev => [{ id: data.id, title: data.title }, ...prev]);
        currentChatId = data.id;
        setActiveChatId(currentChatId);
        navigate(`/chat/${currentChatId}`);
      } catch (e) {
        return;
      }
    }

    const userMsg = { id: `tmp-${Date.now()}`, role: 'user', content: text, created_at: new Date().toISOString() };
    const asstTmpId = `asst-${Date.now()}`;
    const assistantMsg = { id: asstTmpId, role: 'assistant', content: '', created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setSources([]);
    setInput('');

    // Stream from backend
    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${currentChatId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text, top_k: 4 }),
        signal: ctrl.signal,
      });
      if (!resp.ok || !resp.body) throw new Error('Stream error');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Fallback: if no chunks arrive within 5s, abort and call non-stream
      const doFallback = async () => {
        try { controller?.abort(); } catch {}
        try {
          const r = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${currentChatId}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content: text, top_k: 4 }),
          });
          if (!r.ok) throw new Error('fallback request failed');
          const j = await r.json();
          setMessages(prev => prev.map(m => m.id === asstTmpId ? { ...m, content: j.assistant_message?.content || '' } : m));
          if (j.assistant_message?.sources) setSources(j.assistant_message.sources);
        } catch (err) {
          setMessages(prev => prev.map(m => m.id === asstTmpId ? { ...m, content: `[error] ${err.message}` } : m));
        }
      };

      // Primary timer: no data at all within 5s → fallback
      streamTimerRef.current = setTimeout(() => {
        if (!gotChunk) doFallback();
      }, 5000);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() || '';
        for (const f of frames) {
          // Each frame may contain multiple lines like 'event: sources' and 'data: ...'
          const lines = f.split('\n');
          let evt = null; let dataLine = null;
          for (const line of lines) {
            if (line.startsWith('event: ')) evt = line.slice(7).trim();
            if (line.startsWith('data: ')) dataLine = line.slice(6);
          }
          if (!evt && dataLine) {
            // default SSE message chunk
            if (!gotChunk) setGotChunk(true);
            if (streamTimerRef.current) { clearTimeout(streamTimerRef.current); streamTimerRef.current = null; }
            setMessages(prev => prev.map(m => m.id === asstTmpId ? { ...m, content: (m.content || '') + dataLine } : m));
          } else if (evt === 'sources' && dataLine) {
            try { setSources(JSON.parse(dataLine)); } catch { /* ignore */ }
            // Stream is open; switch to secondary wait if no tokens yet
            if (!gotChunk) {
              if (streamTimerRef.current) { clearTimeout(streamTimerRef.current); streamTimerRef.current = null; }
              if (!streamSecondaryTimerRef.current) {
                streamSecondaryTimerRef.current = setTimeout(() => {
                  if (!gotChunk) doFallback();
                }, 7000);
              }
            }
          } else if (evt === 'ready') {
            setStreamReady(true);
            if (!gotChunk) {
              if (streamTimerRef.current) { clearTimeout(streamTimerRef.current); streamTimerRef.current = null; }
              if (!streamSecondaryTimerRef.current) {
                streamSecondaryTimerRef.current = setTimeout(() => {
                  if (!gotChunk) doFallback();
                }, 7000);
              }
            }
          } else if (evt === 'done') {
            // finalize
          }
        }
        if (autoScroll) {
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
        }
      }
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === asstTmpId ? { ...m, content: `[error] ${e.message}` } : m));
    } finally {
      setLoading(false);
      setController(null);
      setStreamReady(false);
      setGotChunk(false);
      if (streamTimerRef.current) { clearTimeout(streamTimerRef.current); streamTimerRef.current = null; }
      if (streamSecondaryTimerRef.current) { clearTimeout(streamSecondaryTimerRef.current); streamSecondaryTimerRef.current = null; }
    }
  };

  const onStop = () => {
    try { controller?.abort(); } catch {}
  };

  const onRegenerate = async () => {
    if (loading) return;
    // Find last user message
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    setInput(lastUser.content);
    // Trigger send with same content
    const fakeEvent = { preventDefault: () => {} };
    await onSend(fakeEvent);
  };

  const ChatItem = ({ c }) => (
    <div
      onClick={() => navigate(`/chat/${c.id}`)}
      className={`chat-item ${c.id === activeChatId ? 'active' : ''}`}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', cursor: 'pointer', borderRadius: 8 }}
    >
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title || 'Untitled'}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="ghost" onClick={(e) => { e.stopPropagation(); onRenameChat(c.id); }}>Rename</button>
        <button className="ghost" onClick={(e) => { e.stopPropagation(); onDeleteChat(c.id); }}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className="chat-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
      <aside style={{ borderRight: '1px solid var(--border-color)', paddingRight: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>Chats</h3>
          <button className="primary" onClick={onNewChat}>New</button>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {loadingChats && <div>Loading…</div>}
          {!loadingChats && chats.length === 0 && <div>No chats yet</div>}
          {chats.map(c => <ChatItem key={c.id} c={c} />)}
        </div>
      </aside>

      <section>
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((m, idx) => (
            <div key={m.id} className={`message ${m.role === 'user' ? 'user-message' : 'bot-message'}`}>
              <div className="message-header">
                <div className={`message-avatar ${m.role === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
                  {m.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.role === 'user' ? 'You' : 'Assistant'}
                  {m.role === 'assistant' && loading && idx === messages.length - 1 && (
                    <span className="typing" aria-label="generating">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  )}
                </div>
              </div>
              <div className="message-content">
                {renderContent(m.content)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {sources && sources.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8, marginLeft: 42 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Sources</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sources.map((s, idx) => {
                const score = typeof s.score === 'number' ? s.score : null;
                const pct = score != null ? (score <= 1 ? Math.round(score * 100) : Math.round(score)) : null;
                const name = s.source_file || s.source || s.filename || 'source';
                return (
                  <span key={idx} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    background: 'var(--surface-elevated)',
                    color: 'var(--text-secondary)',
                    fontSize: 12
                  }}>
                    <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    {pct != null && <span style={{ color: 'var(--text-muted)' }}>{pct}%</span>}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="input-area">
          <form onSubmit={onSend}>
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                rows={1}
              />
              {!loading && (
                <button className="send-btn" type="submit" disabled={!input.trim()}>Send</button>
              )}
              {loading && (
                <button type="button" className="send-btn" onClick={onStop}>Stop</button>
              )}
            </div>
            <div className="input-footer">
              <div>
                <button type="button" className="ghost" onClick={onRegenerate} disabled={loading || messages.filter(m=>m.role==='user').length===0}>Regenerate</button>
              </div>
              <div>Press Enter to send, Shift+Enter for new line</div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
