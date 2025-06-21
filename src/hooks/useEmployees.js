import { useState, useEffect, useCallback } from 'react';
import { employeeApi } from '../api';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all employees with user data
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeApi.getAll();
      setEmployees(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create employee
  const createEmployee = useCallback(
    async employeeData => {
      try {
        setError(null);
        await employeeApi.create(employeeData);
        await fetchEmployees(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create employee';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchEmployees]
  );

  // Update employee
  const updateEmployee = useCallback(
    async (matricule, updateData) => {
      try {
        setError(null);
        await employeeApi.update(matricule, updateData);
        await fetchEmployees(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update employee';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchEmployees]
  );

  // Delete employee
  const deleteEmployee = useCallback(
    async matricule => {
      try {
        setError(null);
        await employeeApi.delete(matricule);
        await fetchEmployees(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete employee';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchEmployees]
  );

  // Delete multiple employees
  const deleteMultipleEmployees = useCallback(
    async matricules => {
      try {
        setError(null);
        await Promise.all(matricules.map(matricule => employeeApi.delete(matricule)));
        await fetchEmployees(); // Refresh list
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete employees';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchEmployees]
  );

  // Initial load
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    deleteMultipleEmployees,
  };
};

export default useEmployees;
