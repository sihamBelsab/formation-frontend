import { useState, useEffect, useCallback } from 'react';
import { trainerApi } from '../api';

export const useTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all trainers
  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainerApi.getAll();
      setTrainers(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trainers');
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create trainer
  const createTrainer = useCallback(
    async trainerData => {
      try {
        setError(null);
        const response = await trainerApi.create(trainerData);
        await fetchTrainers(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create trainer';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainers]
  );

  // Update trainer
  const updateTrainer = useCallback(
    async (id, updateData) => {
      try {
        setError(null);
        const response = await trainerApi.update(id, updateData);
        await fetchTrainers(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update trainer';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainers]
  );

  // Delete trainer
  const deleteTrainer = useCallback(
    async id => {
      try {
        setError(null);
        await trainerApi.delete(id);
        await fetchTrainers(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete trainer';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainers]
  );

  // Initial load
  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  return {
    trainers,
    loading,
    error,
    fetchTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,
  };
};

export default useTrainers;
