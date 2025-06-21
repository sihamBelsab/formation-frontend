import { useState, useEffect, useCallback } from 'react';
import { locationApi } from '../api';

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all locations
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationApi.getAll();
      setLocations(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create location
  const createLocation = useCallback(
    async locationData => {
      try {
        setError(null);

        const response = await locationApi.create(locationData);
        await fetchLocations(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        console.error(err.response.data);
        const errorMessage = err.response?.data?.message || 'Failed to create location';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchLocations]
  );

  // Update location
  const updateLocation = useCallback(
    async (id, updateData) => {
      try {
        setError(null);
        const response = await locationApi.update(id, updateData);
        await fetchLocations(); // Refresh list
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update location';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchLocations]
  );

  // Delete location
  const deleteLocation = useCallback(
    async id => {
      try {
        setError(null);
        await locationApi.delete(id);
        await fetchLocations(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete location';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchLocations]
  );

  // Delete multiple locations
  const deleteMultipleLocations = useCallback(
    async ids => {
      try {
        setError(null);
        await locationApi.deleteMultiple(ids);
        await fetchLocations(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete locations';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchLocations]
  );

  // Initial load
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    error,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    deleteMultipleLocations,
  };
};

export default useLocations;
