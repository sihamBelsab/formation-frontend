import { useState, useEffect, useCallback } from 'react';
import { directionApi } from '../api';

export const useDirections = () => {
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all directions
  const fetchDirections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await directionApi.getAll();
      setDirections(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch directions');
      console.error('Error fetching directions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create direction
  const createDirection = useCallback(
    async directionData => {
      try {
        setError(null);
        const response = await directionApi.create(directionData);
        await fetchDirections(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create direction';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchDirections]
  );

  // Update direction
  const updateDirection = useCallback(
    async (id, updateData) => {
      try {
        setError(null);
        const response = await directionApi.update(id, updateData);
        await fetchDirections(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update direction';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchDirections]
  );

  // Delete direction
  const deleteDirection = useCallback(
    async id => {
      try {
        setError(null);
        await directionApi.delete(id);
        await fetchDirections(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete direction';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchDirections]
  );

  // Initial load
  useEffect(() => {
    fetchDirections();
  }, [fetchDirections]);

  return {
    directions,
    loading,
    error,
    fetchDirections,
    createDirection,
    updateDirection,
    deleteDirection,
  };
};

export default useDirections;
