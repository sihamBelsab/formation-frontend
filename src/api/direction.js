import { apiClient } from './config';

const ENDPOINTS = {
  DIRECTIONS: '/directions',
};

export const directionApi = {
  // Get all directions
  getAll: () => apiClient.get(ENDPOINTS.DIRECTIONS),

  // Get direction by ID
  getById: id => apiClient.get(`${ENDPOINTS.DIRECTIONS}/${id}`),

  // Create new direction
  create: directionData => apiClient.post(ENDPOINTS.DIRECTIONS, directionData),

  // Update direction
  update: (id, directionData) => apiClient.put(`${ENDPOINTS.DIRECTIONS}/${id}`, directionData),

  // Delete direction
  delete: id => apiClient.delete(`${ENDPOINTS.DIRECTIONS}/${id}`),
};

export default directionApi;
