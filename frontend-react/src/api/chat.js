import api from './client';

export const createChat = async (title) => {
  const { data } = await api.post('/api/chats', { title });
  return data; // { id, title }
};

export const listChats = async () => {
  const { data } = await api.get('/api/chats');
  return data; // [ {id, title, ...} ]
};

export const renameChat = async (chatId, title) => {
  const { data } = await api.put(`/api/chats/${chatId}`, { title });
  return data;
};

export const deleteChat = async (chatId) => {
  const { data } = await api.delete(`/api/chats/${chatId}`);
  return data;
};

export const listMessages = async (chatId) => {
  const { data } = await api.get(`/api/chats/${chatId}/messages`);
  return data;
};

export const sendMessage = async (chatId, content) => {
  const { data } = await api.post(`/api/chats/${chatId}/messages`, { content });
  return data; // { user_message: {id}, assistant_message: { id, content } }
};
