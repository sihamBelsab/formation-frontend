import { apiClient } from './config';

const ENDPOINTS = {
  EMPLOYEES: '/employees',
  EMPLOYEES_WITH_USERS: '/employees/with-users',
  POSITIONS: '/positions',
  DIRECTIONS: '/directions',
  USERS: '/users',
};

export const employeeApi = {
  // Get all employees with user data
  getAllWithUsers: () => apiClient.get(ENDPOINTS.EMPLOYEES_WITH_USERS),

  // Get all employees
  getAll: () => apiClient.get(ENDPOINTS.EMPLOYEES),

  // Get employee by matricule
  getByMatricule: matricule => apiClient.get(`${ENDPOINTS.EMPLOYEES}/${matricule}`),

  // Create new employee
  create: employeeData => apiClient.post(ENDPOINTS.EMPLOYEES, employeeData),

  // Update employee
  update: (matricule, updateData) =>
    apiClient.put(`${ENDPOINTS.EMPLOYEES}/${matricule}`, updateData),

  // Delete employee
  delete: matricule => apiClient.delete(`${ENDPOINTS.EMPLOYEES}/${matricule}`),

  // Get positions for dropdown
  getPositions: () => apiClient.get(ENDPOINTS.POSITIONS),

  // Get directions for dropdown
  getDirections: () => apiClient.get(ENDPOINTS.DIRECTIONS),

  // Get users for dropdown
  getUsers: () => apiClient.get(ENDPOINTS.USERS),
};

export default employeeApi;
