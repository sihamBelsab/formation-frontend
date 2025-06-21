// Export all API services from a central location
export { default as employeeApi } from './employee';
export { default as userApi } from './user';
export { default as directionApi } from './direction';
export { default as positionApi } from './position';
export { default as trainerApi } from './trainer';
export { default as trainingApi } from './training';
export { default as trainingNeedApi } from './trainingNeed';
export { default as planApi } from './plan';
export { default as locationApi } from './location';
export { default as dashboardApi } from './dashboard';
export { default as evaluationChaudApi } from './evaluationChaud';

// Export the shared API client
export { apiClient } from './config';
