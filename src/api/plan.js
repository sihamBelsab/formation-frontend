import { apiClient } from './config';

const ENDPOINTS = {
  PLANS: '/plans',
  PLANS_BY_YEAR: year => `/plans/year/${year}`,
  PLAN_BY_ID: id => `/plans/${id}`,
  PLAN_FORMATIONS: (planId, formationId) => 
    formationId 
      ? `/plans/${planId}/formations/${formationId}`
      : `/plans/${planId}/formations`,
  PLAN_SUBMIT: id => `/plans/${id}/submit`,
  PLAN_APPROVE: id => `/plans/${id}/approve`,
  PLAN_REJECT: id => `/plans/${id}/reject`,
  PLAN_NOTES: id => `/plans/${id}/notes`,
  PLAN_RESET: id => `/plans/${id}/reset`,
};

export const planApi = {
  get:(endPoint)=>{
    return apiClient.get(`${ENDPOINTS.PLANS}${endPoint}`);
  },
  // Get all plans with optional status filter
  getAll: (status = null) => {
    const params = status ? { status } : {};
    return apiClient.get(ENDPOINTS.PLANS, { params });
  },

  // Get plans by year
  getByYear: year => apiClient.get(ENDPOINTS.PLANS_BY_YEAR(year)),

  // Get plan by ID
  getById: id => apiClient.get(ENDPOINTS.PLAN_BY_ID(id)),

  // Create new plan
  create: planData => apiClient.post(ENDPOINTS.PLANS, planData),

  // Add formation to plan
  addFormationToPlan: (planId, formationData) => 
    apiClient.post(ENDPOINTS.PLAN_FORMATIONS(planId), formationData),

  // Remove formation from plan
  removeFormationFromPlan: (planId, formationId) => 
    apiClient.delete(ENDPOINTS.PLAN_FORMATIONS(planId, formationId)),

  // Submit plan for validation
  submitForValidation: id => apiClient.patch(ENDPOINTS.PLAN_SUBMIT(id)),

  // Approve plan
  approvePlan: id => apiClient.patch(ENDPOINTS.PLAN_APPROVE(id)),

  // Reject plan
  rejectPlan: (id, rejectionData) => 
    apiClient.patch(ENDPOINTS.PLAN_REJECT(id), rejectionData),

  // Update plan notes
  updatePlanNotes: (id, notesData) => 
    apiClient.patch(ENDPOINTS.PLAN_NOTES(id), notesData),

  // Reset rejected plan to draft
  resetRejectedPlan: id => 
    apiClient.patch(ENDPOINTS.PLAN_RESET(id)),
};

export default planApi;
