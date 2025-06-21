import { apiClient } from './config';

const ENDPOINTS = {
  USERS: '/users',
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  REGISTER: '/users/register',
  LOGGED_IN: '/users/loggedin',
  UPDATE_AVATAR: '/users/:id/updateAvatar',
  MATRICULE: '/users/matricule/:matricule',
  STATUS: '/users/actif/:id',
};

export const userApi = {
  // Get all users
  getAll: () => apiClient.get(ENDPOINTS.USERS),

  // Get user by ID
  getById: id => apiClient.get(`${ENDPOINTS.USERS}/${id}`),

  // Get logged in user info
  getLoggedInUser: () => apiClient.get(ENDPOINTS.LOGGED_IN),

  // Register new user
  register: userData => apiClient.post(ENDPOINTS.REGISTER, userData),

  // Update user
  update: (id, userData) => apiClient.put(`${ENDPOINTS.USERS}/${id}`, userData),

  // Delete user
  delete: id => apiClient.delete(`${ENDPOINTS.USERS}/${id}`),

  // Delete users (multiple)
  deleteMultiple: userIds => {
    const deletePromises = userIds.map(id => apiClient.delete(`${ENDPOINTS.USERS}/${id}`));
    return Promise.all(deletePromises);
  },

  // Login user
  login: (email, password) =>
    apiClient.post(ENDPOINTS.LOGIN, {
      email,
      mot_de_pass: password,
    }),

  // Logout user
  logout: () => apiClient.get(ENDPOINTS.LOGOUT),

  // Update user avatar
  updateAvatar: (id, image) =>
    apiClient.post(ENDPOINTS.UPDATE_AVATAR.replace(':id', id), { image }),

  // Get user by matricule
  getByMatricule: matricule => apiClient.get(ENDPOINTS.MATRICULE.replace(':matricule', matricule)),

  // Toggle user status
  toggleStatus: id => apiClient.put(ENDPOINTS.STATUS.replace(':id', id)),
};

export default userApi;
