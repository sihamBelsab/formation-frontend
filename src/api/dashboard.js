import { apiClient } from './config';

const ENDPOINTS = {
  STATS: '/dashboard/stats',
  EMPLOYEE_DISTRIBUTION: '/dashboard/employee-distribution',
  TRAINING_NEEDS_BY_DIRECTION: '/dashboard/training-needs-by-direction',
  TRAINING_NEEDS_BY_PRIORITY: '/dashboard/training-needs-by-priority',
  RECENT_TRAINING_NEEDS: '/dashboard/recent-training-needs',
  EMPLOYEES_BY_DIRECTION: '/dashboard/employees-by-direction',
  FORMATIONS_BY_CATEGORY: '/dashboard/formations-by-category',
  EVALUATION_SATISFACTION: '/dashboard/evaluation-satisfaction',
};

export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => apiClient.get(ENDPOINTS.STATS),

  // Get employee distribution by grade
  getEmployeeDistribution: () => apiClient.get(ENDPOINTS.EMPLOYEE_DISTRIBUTION),

  // Get training needs by direction
  getTrainingNeedsByDirection: () => apiClient.get(ENDPOINTS.TRAINING_NEEDS_BY_DIRECTION),

  // Get training needs by priority
  getTrainingNeedsByPriority: () => apiClient.get(ENDPOINTS.TRAINING_NEEDS_BY_PRIORITY),

  // Get recent training needs
  getRecentTrainingNeeds: () => apiClient.get(ENDPOINTS.RECENT_TRAINING_NEEDS),

  // Get employees by direction
  getEmployeesByDirection: () => apiClient.get(ENDPOINTS.EMPLOYEES_BY_DIRECTION),

  // Get formations by category
  getFormationsByCategory: () => apiClient.get(ENDPOINTS.FORMATIONS_BY_CATEGORY),

  // Get evaluation satisfaction averages
  getEvaluationSatisfaction: () => apiClient.get(ENDPOINTS.EVALUATION_SATISFACTION),
};

export default dashboardApi;
