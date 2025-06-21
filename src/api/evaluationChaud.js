import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const evaluationChaudApi = {
  createEvaluation: async (evaluationData) => {
    try {
      const response = await axios.post(`${API_URL}/evaluation-chaud`, evaluationData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEvaluationsByFormation: async (id_formation) => {
    try {
      const response = await axios.get(`${API_URL}/evaluation-chaud/formation/${id_formation}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEvaluationsByEmployee: async () => {
    try {
      const response = await axios.get(`${API_URL}/evaluation-chaud/employee`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 


export default evaluationChaudApi;