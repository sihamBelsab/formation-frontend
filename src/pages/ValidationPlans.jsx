import React, { useState } from 'react';
import { Card, Alert, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { usePlans } from '../hooks';
import Table from '../components/common/Table';
import PlanDetailsModal from '../components/GestionPlan/PlanDetailsModal';
import RejectPlanModal from '../components/GestionPlan/RejectPlanModal';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';

const GestionPlanDirecteurGeneral = ({ userInfo }) => {
  const { plans, loading, error, fetchPlans, getPlanById, approvePlan, rejectPlan } = usePlans([
    'à valider',
    'rejeté',
    'approuvé',
  ]); // Only show plans that need validation or are approved
  console.log(plans);
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Data states
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentPlanDetails, setCurrentPlanDetails] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Helper function to get status badge
  const getStatusBadge = status => {
    const statusConfig = {
      brouillon: { variant: 'warning', text: 'Brouillon' },
      'à valider': { variant: 'info', text: 'À Valider' },
      approuvé: { variant: 'success', text: 'Approuvé' },
      rejeté: { variant: 'danger', text: 'Rejeté' },
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  // Handle plan selection
  const handleSelectionChange = selectedIndices => {
    const selectedObjects = selectedIndices.map(index => plans[index]);
    setSelectedPlans(selectedObjects);
  };

  // Handle view plan details
  const handleViewDetails = async (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan) return;

    const result = await getPlanById(targetPlan.id);
    if (result.success) {
      setCurrentPlanDetails(result.data);
      setShowDetailsModal(true);
    }
  };

  // Handle approve plan
  const handleApprovePlan = (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan || targetPlan.statut !== 'à valider') return;

    setConfirmAction({
      type: 'approve',
      plan: targetPlan,
      title: 'Approuver le plan',
      message: `Êtes-vous sûr de vouloir approuver le plan ${targetPlan.annee} ?`,
      confirmText: 'Approuver',
      confirmVariant: 'success',
    });
    setShowConfirmModal(true);
  };

  // Handle reject plan
  const handleRejectPlan = (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan || targetPlan.statut !== 'à valider') return;

    setCurrentPlanDetails(targetPlan);
    setShowRejectModal(true);
  };

  // Handle approve confirmation
  const handleConfirmApprove = async () => {
    if (!confirmAction || confirmAction.type !== 'approve') return;

    const result = await approvePlan(confirmAction.plan.id);
    if (result.success) {
      setShowConfirmModal(false);
      setConfirmAction(null);
      setSelectedPlans([]);
      fetchPlans(); // Refresh the list
    }
    return result;
  };

  // Handle reject form submission
  const handleRejectSubmit = async rejectionData => {
    console.log(rejectionData);
    console.log(currentPlanDetails);
    if (!currentPlanDetails) return { success: false, error: 'No plan selected' };

    const result = await rejectPlan(currentPlanDetails.id, rejectionData);
    if (result.success) {
      setShowRejectModal(false);
      setCurrentPlanDetails(null);
      setSelectedPlans([]);
      fetchPlans(); // Refresh the list
    }
    return result;
  };

  // Get table actions based on selected plan
  const getActions = () => {
    const actions = [];

    if (selectedPlans.length === 1) {
      const selectedPlan = selectedPlans[0];

      actions.push({
        label: 'Voir Détails',
        icon: <FaEye className='me-1' />,
        onClick: () => handleViewDetails(),
        variant: 'info',
      });

      // Actions for plans pending validation
      if (selectedPlan.statut === 'à valider' && userInfo.role == 'directeur_general') {
        actions.push(
          {
            label: 'Approuver',
            icon: <FaCheck className='me-1' />,
            onClick: () => handleApprovePlan(),
            variant: 'success',
          },
          {
            label: 'Rejeter',
            icon: <FaTimes className='me-1' />,
            onClick: () => handleRejectPlan(),
            variant: 'danger',
          }
        );
      }
    }

    return actions;
  };

  // Authorization check
  if (!userInfo) {
    return <Loader />;
  }

  if (!['directeur_general', 'admin', 'directeur_rh'].includes(userInfo.role)) {
    return <Error message="Vous n'avez pas accès à cette page" showHomeLink={true} />;
  }

  // Table columns configuration
  const columns = [
    { key: 'annee', label: 'Année', sortable: true },
    {
      key: 'statut',
      label: 'Statut',
      sortable: true,
      render: value => getStatusBadge(value),
    },

    {
      key: 'notes',
      label: 'Notes',
      render: value => {
        if (!value) return 'Aucune note';

        // Show rejection notes prominently for rejected plans
        const isRejectionNote = value.includes('Rejeté') || value.includes('rejet');
        return (
          <span title={value} className={isRejectionNote ? 'text-danger fw-bold' : ''}>
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </span>
        );
      },
    },
  ];

  return (
    <div className='main-content'>
      <div className='container-fluid'>
        {error && (
          <Alert variant='danger' className='alert error'>
            {error}
          </Alert>
        )}

        <Table
          title='Plans à Valider'
          data={plans}
          columns={columns}
          loading={loading}
          actions={getActions()}
          selectable={true}
          selectedItems={selectedPlans.map(plan => plans.findIndex(p => p.id === plan.id))}
          onSelectionChange={handleSelectionChange}
          searchable={true}
          searchPlaceholder='Rechercher un plan...'
          emptyMessage='Aucun plan à valider'
          loadingMessage='Chargement des plans...'
          exportable={true}
          exportFilename='plans-validation'
          pageSize={10}
          showPagination={true}
          hover={true}
          striped={true}
          responsive={true}
        />

        {/* Plan Details Modal */}
        <PlanDetailsModal
          show={showDetailsModal}
          onHide={() => {
            setShowDetailsModal(false);
            setCurrentPlanDetails(null);
          }}
          plan={currentPlanDetails}
          loading={loading}
        />

        {/* Reject Plan Modal */}
        <RejectPlanModal
          show={showRejectModal}
          onHide={() => {
            setShowRejectModal(false);
            setCurrentPlanDetails(null);
          }}
          plan={currentPlanDetails}
          onSave={handleRejectSubmit}
          loading={loading}
          onReject={handleRejectSubmit}
        />

        {/* Confirm Action Modal */}
        <ConfirmModal
          show={showConfirmModal}
          onHide={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
          title={confirmAction?.title}
          message={confirmAction?.message}
          confirmText={confirmAction?.confirmText}
          confirmVariant={confirmAction?.confirmVariant}
          onConfirm={handleConfirmApprove}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default GestionPlanDirecteurGeneral;
