import { apiClient } from './config';

const ENDPOINTS = {
  POSITIONS: '/positions',
};

export const positionApi = {
  // Get all positions
  getAll: () => apiClient.get(ENDPOINTS.POSITIONS),

  // Get position by ID
  getById: id => apiClient.get(`${ENDPOINTS.POSITIONS}/${id}`),

  // Create new position
  create: positionData => apiClient.post(ENDPOINTS.POSITIONS, positionData),

  // Update position
  update: (id, positionData) => apiClient.put(`${ENDPOINTS.POSITIONS}/${id}`, positionData),

  // Delete position
  delete: id => apiClient.delete(`${ENDPOINTS.POSITIONS}/${id}`),
};

export default positionApi;
