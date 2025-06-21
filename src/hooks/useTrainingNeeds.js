import { useState, useEffect, useCallback } from 'react';
import { trainingNeedApi, directionApi, employeeApi } from '../api';

export const useTrainingNeeds = () => {
  const [trainingNeeds, setTrainingNeeds] = useState([]);
  const [directions, setDirections] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all training needs
  const fetchTrainingNeeds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainingNeedApi.getAll();
      setTrainingNeeds(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch training needs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch directions
  const fetchDirections = useCallback(async () => {
    try {
      const response = await directionApi.getAll();
      setDirections(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching directions:', err);
    }
  }, []);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, []);

  // Create training need
  const createTrainingNeed = useCallback(
    async trainingNeedData => {
      try {
        setError(null);
        const response = await trainingNeedApi.create(trainingNeedData);
        await fetchTrainingNeeds(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create training need';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainingNeeds]
  );

  // Update training need
  const updateTrainingNeed = useCallback(
    async (id, updateData) => {
      try {
        setError(null);
        const response = await trainingNeedApi.update(id, updateData);
        await fetchTrainingNeeds(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update training need';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainingNeeds]
  );

  // Delete training need
  const deleteTrainingNeed = useCallback(
    async id => {
      try {
        setError(null);
        await trainingNeedApi.delete(id);
        await fetchTrainingNeeds(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete training need';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainingNeeds]
  );

  // Delete multiple training needs
  const deleteMultipleTrainingNeeds = useCallback(
    async ids => {
      try {
        setError(null);
        await trainingNeedApi.deleteMultiple(ids);
        await fetchTrainingNeeds(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete training needs';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchTrainingNeeds]
  );

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTrainingNeeds(), fetchDirections(), fetchEmployees()]);
    };
    loadData();
  }, [fetchTrainingNeeds, fetchDirections, fetchEmployees]);

  return {
    trainingNeeds,
    directions,
    employees,
    loading,
    error,
    fetchTrainingNeeds,
    createTrainingNeed,
    updateTrainingNeed,
    deleteTrainingNeed,
    deleteMultipleTrainingNeeds,
  };
};

export default useTrainingNeeds;
