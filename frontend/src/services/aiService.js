import api from './api';

export const aiService = {
  async generateSchedule(params) {
    const response = await api.post('/ai/generate-schedule', params);
    return response.data;
  },

  async chatWithAi(messageOrPayload) {
    const payload = typeof messageOrPayload === 'string'
      ? { message: messageOrPayload }
      : messageOrPayload;
    const response = await api.post('/ai/chat', payload);
    return response.data;
  },

  async roadmapChat({ message, topic, track, action, difficulty }) {
    const response = await api.post('/ai/chat', {
      message,
      topic,
      track,
      action: action || 'EXPLAIN',
      difficulty: difficulty || 'Intermediate',
    });
    return response.data;
  },
};

export default aiService;
