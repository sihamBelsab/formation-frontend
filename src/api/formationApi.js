import axios from 'axios';
import { API_BASE_URL } from './config';

const formationApi = {
  // ... existing methods ...

  getCompletedFormations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainings/completed`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed formations:', error);
      throw error;
    }
  }
};

export default formationApi; 