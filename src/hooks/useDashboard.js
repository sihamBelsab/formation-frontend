import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../api';

export const useDashboard = () => {
  const [stats, setStats] = useState({
    formations: 0,
    employees: 0,
    locations: 0,
    trainers: 0,
    trainingNeeds: 0,
    directions: 0,
    positions: 0,
  });

  const [employeeDistribution, setEmployeeDistribution] = useState([]);
  const [trainingNeedsByDirection, setTrainingNeedsByDirection] = useState([]);
  const [trainingNeedsByPriority, setTrainingNeedsByPriority] = useState([]);
  const [recentTrainingNeeds, setRecentTrainingNeeds] = useState([]);
  const [employeesByDirection, setEmployeesByDirection] = useState([]);
  const [formationsByCategory, setFormationsByCategory] = useState([]);
  const [evaluationSatisfaction, setEvaluationSatisfaction] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await dashboardApi.getStats();
      setStats(response.data || {});
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard statistics');
    }
  }, []);

  // Fetch employee distribution
  const fetchEmployeeDistribution = useCallback(async () => {
    try {
      const response = await dashboardApi.getEmployeeDistribution();
      setEmployeeDistribution(response.data || []);
    } catch (err) {
      console.error('Error fetching employee distribution:', err);
    }
  }, []);

  // Fetch training needs by direction
  const fetchTrainingNeedsByDirection = useCallback(async () => {
    try {
      const response = await dashboardApi.getTrainingNeedsByDirection();
      setTrainingNeedsByDirection(response.data || []);
    } catch (err) {
      console.error('Error fetching training needs by direction:', err);
    }
  }, []);

  // Fetch training needs by priority
  const fetchTrainingNeedsByPriority = useCallback(async () => {
    try {
      const response = await dashboardApi.getTrainingNeedsByPriority();
      setTrainingNeedsByPriority(response.data || []);
    } catch (err) {
      console.error('Error fetching training needs by priority:', err);
    }
  }, []);

  // Fetch recent training needs
  const fetchRecentTrainingNeeds = useCallback(async () => {
    try {
      const response = await dashboardApi.getRecentTrainingNeeds();
      setRecentTrainingNeeds(response.data || []);
    } catch (err) {
      console.error('Error fetching recent training needs:', err);
    }
  }, []);

  // Fetch employees by direction
  const fetchEmployeesByDirection = useCallback(async () => {
    try {
      const response = await dashboardApi.getEmployeesByDirection();
      setEmployeesByDirection(response.data || []);
    } catch (err) {
      console.error('Error fetching employees by direction:', err);
    }
  }, []);

  // Fetch formations by category
  const fetchFormationsByCategory = useCallback(async () => {
    try {
      const response = await dashboardApi.getFormationsByCategory();
      setFormationsByCategory(response.data || []);
    } catch (err) {
      console.error('Error fetching formations by category:', err);
    }
  }, []);

  // Fetch evaluation satisfaction
  const fetchEvaluationSatisfaction = useCallback(async () => {
    try {
      const response = await dashboardApi.getEvaluationSatisfaction();
      setEvaluationSatisfaction(response.data || []);
    } catch (err) {
      console.error('Error fetching evaluation satisfaction:', err);
    }
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchStats(),
        fetchEmployeeDistribution(),
        fetchTrainingNeedsByDirection(),
        fetchTrainingNeedsByPriority(),
        fetchRecentTrainingNeeds(),
        fetchEmployeesByDirection(),
        fetchFormationsByCategory(),
        fetchEvaluationSatisfaction(),
      ]);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [
    fetchStats,
    fetchEmployeeDistribution,
    fetchTrainingNeedsByDirection,
    fetchTrainingNeedsByPriority,
    fetchRecentTrainingNeeds,
    fetchEmployeesByDirection,
    fetchFormationsByCategory,
    fetchEvaluationSatisfaction,
  ]);

  // Refresh all data
  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    employeeDistribution,
    trainingNeedsByDirection,
    trainingNeedsByPriority,
    recentTrainingNeeds,
    employeesByDirection,
    formationsByCategory,
    evaluationSatisfaction,
    loading,
    error,
    refreshData,
  };
};

export default useDashboard;
