import { useState, useEffect, useCallback } from 'react';
import { positionApi } from '../api';

export const usePositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all positions
  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await positionApi.getAll();
      setPositions(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch positions');
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create position
  const createPosition = useCallback(
    async positionData => {
      try {
        setError(null);
        const response = await positionApi.create(positionData);
        await fetchPositions(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create position';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchPositions]
  );

  // Update position
  const updatePosition = useCallback(
    async (id, updateData) => {
      try {
        setError(null);
        const response = await positionApi.update(id, updateData);
        await fetchPositions(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update position';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchPositions]
  );

  // Delete position
  const deletePosition = useCallback(
    async id => {
      try {
        setError(null);
        await positionApi.delete(id);
        await fetchPositions(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete position';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchPositions]
  );

  // Initial load
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return {
    positions,
    loading,
    error,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
  };
};

export default usePositions;
