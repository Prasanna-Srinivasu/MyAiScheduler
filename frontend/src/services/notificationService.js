import api from './api';

export const notificationService = {
  async getNotifications(unreadOnly = false) {
    const response = await api.get('/notifications', { params: { unreadOnly } });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },

  async deleteNotification(id) {
    await api.delete(`/notifications/${id}`);
  },
};

export default notificationService;
