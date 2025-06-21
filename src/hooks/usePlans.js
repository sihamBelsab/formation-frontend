import { useState, useEffect, useCallback, useRef } from 'react';
import { planApi } from '../api/plan';
import { trainingApi as formationApi } from '../api/training';

export const usePlans = (initialStatus = null) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableFormations, setAvailableFormations] = useState([]);
  const [formationsLoading, setFormationsLoading] = useState(false);
  
  // Use ref to store the current status
  const statusRef = useRef(initialStatus);
  
  // Update ref when initialStatus changes
  useEffect(() => {
    statusRef.current = initialStatus;
  }, [initialStatus]);

  // Fetch all plans with optional status filter
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      const currentStatus = statusRef.current;
      
      if (Array.isArray(currentStatus)) {
        // If status is an array, fetch all plans and filter them
        response = await planApi.getAll();
        const filteredPlans = response.data.data.filter(plan => 
          currentStatus.includes(plan.statut)
        );
        setPlans(filteredPlans);
      } else {
        // Otherwise use getAll with single status
        response = await planApi.getAll(currentStatus);
        setPlans(response.data.data || response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since we use ref

  // Fetch available formations for selection
  const fetchAvailableFormations = useCallback(async () => {
    try {
      setFormationsLoading(true);
      const response = await formationApi.getAllWithNoPlan();
      setAvailableFormations(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching formations:', err);
    } finally {
      setFormationsLoading(false);
    }
  }, []);

  // Get plan by ID with full details
  const getPlanById = useCallback(async planId => {
    try {
      const response = await planApi.getById(planId);
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch plan details';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Create new plan
  const createPlan = useCallback(async planData => {
    try {
      setError(null);
      await planApi.create(planData);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Add formation to plan
  const addFormationToPlan = useCallback(async (planId, formationData) => {
    try {
      setError(null);
      await planApi.addFormationToPlan(planId, formationData);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add formation to plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Remove formation from plan
  const removeFormationFromPlan = useCallback(async (planId, formationId) => {
    try {
      setError(null);
      await planApi.removeFormationFromPlan(planId, formationId);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove formation from plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Submit plan for validation
  const submitForValidation = useCallback(async planId => {
    try {
      setError(null);
      await planApi.submitForValidation(planId);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit plan for validation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Approve plan
  const approvePlan = useCallback(async planId => {
    try {
      setError(null);
      await planApi.approvePlan(planId);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to approve plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Reject plan
  const rejectPlan = useCallback(async (planId, rejectionData) => {
    try {
      setError(null);
      await planApi.rejectPlan(planId, rejectionData);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reject plan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Update plan notes
  const updatePlanNotes = useCallback(async (planId, notesData) => {
    try {
      setError(null);
      await planApi.updatePlanNotes(planId, notesData);
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update plan notes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Reset rejected plan to draft
  const resetRejectedPlan = useCallback(async planId => {
    try {
      setError(null);
      console.log('resetRejectedPlan', planId);
      await planApi.resetRejectedPlan(planId);
      console.log('fetchPlans');
      await fetchPlans();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset plan';
      console.log('errorMessage', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchPlans]);

  // Initial load
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    availableFormations,
    formationsLoading,
    fetchPlans,
    fetchAvailableFormations,
    getPlanById,
    createPlan,
    addFormationToPlan,
    removeFormationFromPlan,
    submitForValidation,
    approvePlan,
    rejectPlan,
    updatePlanNotes,
    resetRejectedPlan,
  };
};

export default usePlans;
