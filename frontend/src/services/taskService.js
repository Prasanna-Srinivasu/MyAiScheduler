import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTasksRange(start, end) {
    const response = await api.get('/tasks/range', { params: { start, end } });
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async toggleTaskStatus(id) {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
