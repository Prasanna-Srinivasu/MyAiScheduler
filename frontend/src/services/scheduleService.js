import api from './api';

export const scheduleService = {
  async getDailySchedule(date) {
    const response = await api.get('/schedules/daily', { params: { date } });
    return response.data;
  },

  async getSchedulesRange(start, end) {
    const response = await api.get('/schedules/range', { params: { start, end } });
    return response.data;
  },
};

export default scheduleService;
