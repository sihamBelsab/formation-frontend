import { apiClient } from './config';

const ENDPOINTS = {
  LOCATIONS: '/lieu',
  DELETE_MULTIPLE: '/lieu/delete',
};

export const locationApi = {
  // Get all locations
  getAll: () => apiClient.get(ENDPOINTS.LOCATIONS),

  // Get location by ID
  getById: id => apiClient.get(`${ENDPOINTS.LOCATIONS}/${id}`),

  // Create new location
  create: locationData => apiClient.post(ENDPOINTS.LOCATIONS, locationData),

  // Update location
  update: (id, locationData) => apiClient.put(`${ENDPOINTS.LOCATIONS}/${id}`, locationData),

  // Delete location
  delete: id => apiClient.delete(`${ENDPOINTS.LOCATIONS}/${id}`),

  // Delete multiple locations
  deleteMultiple: ids => apiClient.post(ENDPOINTS.DELETE_MULTIPLE, { IDs: ids }),
};

export default locationApi;
