import { apiClient } from './config';

const ENDPOINTS = {
  TRAININGS: '/trainings',
};

export const trainingApi = {
  // Get all trainings
  getAll: () => apiClient.get(ENDPOINTS.TRAININGS),

  // Get all trainings with details
  getAllWithDetails: () => apiClient.get(`${ENDPOINTS.TRAININGS}/with-details`),

  // Get trainings with no plan
  getAllWithNoPlan: () => apiClient.get(`${ENDPOINTS.TRAININGS}/no-plan`),

  // Get training by ID
  getById: id => apiClient.get(`${ENDPOINTS.TRAININGS}/${id}`),

  // Get training by ID with details
  getByIdWithDetails: id => apiClient.get(`${ENDPOINTS.TRAININGS}/${id}/details`),

  // Create new training
  create: trainingData => apiClient.post(ENDPOINTS.TRAININGS, trainingData),

  // Update training
  update: (id, trainingData) => apiClient.put(`${ENDPOINTS.TRAININGS}/${id}`, trainingData),

  // Delete training
  delete: id => apiClient.delete(`${ENDPOINTS.TRAININGS}/${id}`),

  // Get trainings by status
  getByStatus: status => apiClient.get(`${ENDPOINTS.TRAININGS}/status/${status}`),

  // Get trainings by category
  getByCategory: category => apiClient.get(`${ENDPOINTS.TRAININGS}/category/${category}`),

  // Search trainings
  search: criteria => apiClient.post(`${ENDPOINTS.TRAININGS}/search`, criteria),

  getCompletedTrainings: () => apiClient.get(`${ENDPOINTS.TRAININGS}/completed`),
};

export default trainingApi;
