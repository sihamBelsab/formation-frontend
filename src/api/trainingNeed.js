import { apiClient } from './config';

const ENDPOINTS = {
  TRAINING_NEEDS: '/besoins',
  DELETE_MULTIPLE: '/besoins/delete',
};

export const trainingNeedApi = {
  // Get all training needs
  getAll: () => apiClient.get(ENDPOINTS.TRAINING_NEEDS),

  // Get training need by ID
  getById: id => apiClient.get(`${ENDPOINTS.TRAINING_NEEDS}/${id}`),

  // Create new training need
  create: trainingNeedData => apiClient.post(ENDPOINTS.TRAINING_NEEDS, trainingNeedData),

  // Update training need
  update: (id, trainingNeedData) =>
    apiClient.put(`${ENDPOINTS.TRAINING_NEEDS}/${id}`, trainingNeedData),

  // Delete training need
  delete: id => apiClient.delete(`${ENDPOINTS.TRAINING_NEEDS}/${id}`),

  // Delete multiple training needs
  deleteMultiple: ids => apiClient.post(ENDPOINTS.DELETE_MULTIPLE, { IDs: ids }),
};

export default trainingNeedApi;
