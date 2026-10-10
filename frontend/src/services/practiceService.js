import api from './api';

export const practiceService = {
  async getPatterns() {
    const response = await api.get('/practice/patterns');
    return response.data;
  },

  async getMetadata() {
    const response = await api.get('/practice/metadata');
    return response.data;
  },

  async getProblems(params = {}) {
    const response = await api.get('/practice/problems', { params });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/practice/stats');
    return response.data;
  },

  async updateProblemStatus(problemId, status, solutionNotes = null) {
    const response = await api.put(`/practice/problems/${problemId}/status`, {
      status,
      solutionNotes,
    });
    return response.data;
  },

  async createProblem(problemData) {
    const response = await api.post('/practice/problems', problemData);
    return response.data;
  },
};

export default practiceService;
