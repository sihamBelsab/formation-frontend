import { apiClient } from './config';

const ENDPOINTS = {
  TRAINERS: '/trainers',
};

export const trainerApi = {
  // Get all trainers
  getAll: () => apiClient.get(ENDPOINTS.TRAINERS),

  // Get trainer by ID
  getById: id => apiClient.get(`${ENDPOINTS.TRAINERS}/${id}`),

  // Create new trainer
  create: trainerData => apiClient.post(ENDPOINTS.TRAINERS, trainerData),

  // Update trainer
  update: (id, trainerData) => apiClient.put(`${ENDPOINTS.TRAINERS}/${id}`, trainerData),

  // Delete trainer
  delete: id => apiClient.delete(`${ENDPOINTS.TRAINERS}/${id}`),
};

export default trainerApi;
