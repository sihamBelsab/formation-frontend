import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAll();
      setUsers(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(
    async userData => {
      try {
        setError(null);
        const response = await userApi.register(userData);
        await fetchUsers(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create user';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchUsers]
  );

  // Update user
  const updateUser = useCallback(
    async (id, updateData) => {
      try {
        setError(null);
        const response = await userApi.update(id, updateData);
        await fetchUsers(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update user';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchUsers]
  );

  // Delete multiple users
  const deleteUsers = useCallback(
    async userIds => {
      try {
        setError(null);
        await userApi.deleteMultiple(userIds);
        await fetchUsers(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete users';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchUsers]
  );

  // Login user
  const loginUser = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await userApi.login(email, password);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout user
  const logoutUser = useCallback(async () => {
    try {
      setError(null);
      const response = await userApi.logout();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update avatar
  const updateAvatar = useCallback(
    async (id, image) => {
      try {
        setError(null);
        const response = await userApi.updateAvatar(id, image);
        await fetchUsers(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update avatar';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchUsers]
  );

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUsers,
    loginUser,
    logoutUser,
    updateAvatar,
  };
};

export default useUsers;
