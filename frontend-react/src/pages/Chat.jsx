import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import { useAuth } from '../context/AuthContext';
import {
  createChat,
  listChats,
  listMessages,
  sendMessage,
  renameChat,
  deleteChat,
} from '../api/chat';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);

  // Initialize chat or load history
  useEffect(() => {
    const initChat = async () => {
      try {
        if (!user) return;

        const chatList = await listChats();
        setChats(chatList);

        if (chatList.length > 0) {
          // Load the most recent chat by default
          const lastChat = chatList[0];
          setChatId(lastChat.id);
          const msgs = await listMessages(lastChat.id);
          setMessages(msgs);
        } else {
          // Create a new chat if none exist
          handleNewChat();
        }
      } catch (err) {
        console.error('Failed to init chat', err);
        setMessages([
          {
            role: 'assistant',
            content:
              'I could not load your previous chats. You can still start a new conversation.',
          },
        ]);
      }
    };

    initChat();
  }, [user]);

  const handleNewChat = async () => {
    try {
      const newChat = await createChat('New Chat');
      setChats(prev => [newChat, ...prev]);
      setChatId(newChat.id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create new chat', err);
    }
  };

  const handleSelectChat = async (id) => {
    if (id === chatId) return;
    setChatId(id);
    setLoading(true);
    try {
      const msgs = await listMessages(id);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load chat messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameChat = async (id, newTitle) => {
    try {
      await renameChat(id, newTitle);
      setChats(prev => prev.map(chat =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      ));
    } catch (err) {
      console.error('Failed to rename chat', err);
    }
  };

  const handleDeleteChat = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      await deleteChat(id);
      setChats(prev => prev.filter(chat => chat.id !== id));
      if (id === chatId) {
        setChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete chat', err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      let currentChatId = chatId;

      // If for some reason we don't have a chat yet, create one on the fly
      if (!currentChatId) {
        const newChat = await createChat('New Chat');
        currentChatId = newChat.id;
        setChatId(currentChatId);
        setChats(prev => [newChat, ...prev]);
      }

      const data = await sendMessage(currentChatId, text);

      if (!data?.assistant_message) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'The server did not return a valid response. Please try again.',
          },
        ]);
        return;
      }

      const assistantMsg = {
        role: 'assistant',
        content: data.assistant_message.content,
        sources: data.assistant_message.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const backendMessage =
        err?.response?.data?.error ||
        'Network or server error. Please check if the backend is running.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: backendMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ height: '100%' }}>
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
        chats={chats}
        activeChatId={chatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        user={user}
      />
    </div>
  );
};

export default Chat;
