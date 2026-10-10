import api from './api';

export const courseService = {
  async getCourses(category = null) {
    const params = category ? { category } : {};
    const response = await api.get('/courses', { params });
    return response.data;
  },

  async getCourseDetails(courseId) {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  async searchCourses(query) {
    const response = await api.get('/courses/search', { params: { q: query } });
    return response.data;
  },

  async createCourse(courseData) {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  async addTopic(courseId, topicData) {
    const response = await api.post(`/courses/${courseId}/topics`, topicData);
    return response.data;
  },

  async addSubtopic(topicId, subtopicData) {
    const response = await api.post(`/courses/topics/${topicId}/subtopics`, subtopicData);
    return response.data;
  },

  async updateTopicStatus(topicId, status) {
    const response = await api.put(`/courses/topics/${topicId}/status`, { status });
    return response.data;
  },

  async deleteCourse(courseId) {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },
};

export default courseService;
