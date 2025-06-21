import React, { useState, useEffect } from 'react';
import { Card, Alert, Badge } from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaPaperPlane,
  FaUndo,
} from 'react-icons/fa';
import { usePlans } from '../hooks';
import Table from '../components/common/Table';
import CreatePlanModal from '../components/GestionPlan/CreatePlanModal';
import PlanDetailsModal from '../components/GestionPlan/PlanDetailsModal';
import AddFormationModal from '../components/GestionPlan/AddFormationModal';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';

const GestionPlanServiceFormation = ({ userInfo }) => {
  const {
    plans,
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
    updatePlanNotes,
    resetRejectedPlan,
  } = usePlans();
  const [loading, setLoading] = useState(false);
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddFormationModal, setShowAddFormationModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Data states
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
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

  // Handle create new plan
  const handleCreatePlan = () => {
    setShowCreateModal(true);
  };

  // Handle view plan details
  const handleViewDetails = async (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan) return;

    const result = await getPlanById(targetPlan.id);
    if (result.success) {
      console.log('result', result.data);
      setCurrentPlanDetails(result.data);
      setShowDetailsModal(true);
    }
  };

  // Handle add formation to plan
  const handleAddFormation = (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan || targetPlan.statut !== 'brouillon') return;

    setCurrentPlan(targetPlan);
    setShowAddFormationModal(true);
  };

  // Handle submit for validation
  const handleSubmitForValidation = (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan || targetPlan.statut !== 'brouillon') return;

    setConfirmAction({
      type: 'submit',
      plan: targetPlan,
      title: 'Soumettre le plan pour validation',
      message: `Êtes-vous sûr de vouloir soumettre le plan ${targetPlan.annee} pour validation ?`,
      confirmText: 'Soumettre',
      confirmVariant: 'primary',
    });
    setShowConfirmModal(true);
  };

  // Handle reset rejected plan
  const handleResetPlan = (plan = null) => {
    const targetPlan = plan || (selectedPlans.length === 1 ? selectedPlans[0] : null);
    if (!targetPlan || targetPlan.statut !== 'rejeté') return;

    setConfirmAction({
      type: 'reset',
      plan: targetPlan,
      title: 'Remettre le plan en brouillon',
      message: `Êtes-vous sûr de vouloir remettre le plan ${targetPlan.annee} en brouillon ?`,
      confirmText: 'Remettre en brouillon',
      confirmVariant: 'warning',
    });
    setShowConfirmModal(true);
  };

  // Handle create plan form submission
  const handleCreatePlanSubmit = async planData => {
    const result = await createPlan(planData);
    if (result.success) {
      setShowCreateModal(false);
    }
    return result;
  };

  // Handle add formation form submission
  const handleAddFormationSubmit = async formationData => {
    if (!currentPlan) return { success: false, error: 'No plan selected' };

    const result = await addFormationToPlan(currentPlan.id, formationData);
    if (result.success) {
      if (showDetailsModal) {
        handleViewDetails();
      }
      setShowAddFormationModal(false);
      setCurrentPlan(null);
    }
    return result;
  };

  // Handle formation removal
  const handleRemoveFormation = async formationId => {
    if (!currentPlanDetails) return;

    const result = await removeFormationFromPlan(currentPlanDetails.id, formationId);
    if (result.success) {
      // Refresh plan details
      const updatedResult = await getPlanById(currentPlanDetails.id);
      if (updatedResult.success) {
        setCurrentPlanDetails(updatedResult.data);
      }
    }
    return result;
  };

  // Handle confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    let result;
    switch (confirmAction.type) {
      case 'submit':
        result = await submitForValidation(confirmAction.plan.id);
        break;
      case 'reset':
        console.log('reset', confirmAction.plan.id);
        result = await resetRejectedPlan(confirmAction.plan.id);
        break;
      default:
        result = { success: false };
    }

    if (result.success) {
      setShowConfirmModal(false);
      setConfirmAction(null);
      setSelectedPlans([]);
    }
    return result;
  };

  // Get table actions based on selected plan
  const getActions = () => {
    const actions = [];
    if (userInfo.role == 'service_formation') {
      actions.push(
        {
          label: 'Créer Plan',
          icon: <FaPlus className='me-1' />,
          onClick: handleCreatePlan,
          variant: 'success',
        },
        {
          label: 'Voir Détails',
          icon: <FaEye className='me-1' />,
          onClick: () => handleViewDetails(),
          variant: 'info',
          disabled: !(selectedPlans.length === 1),
        }
      );
    }
    if (selectedPlans.length === 1) {
      const selectedPlan = selectedPlans[0];

      // Actions for brouillon status
      if (selectedPlan.statut === 'brouillon' && userInfo.role == 'service_formation') {
        actions.push(
          {
            label: 'Ajouter Formation',
            icon: <FaPlus className='me-1' />,
            onClick: () => handleAddFormation(),
            variant: 'primary',
          },
          {
            label: 'Soumettre',
            icon: <FaPaperPlane className='me-1' />,
            onClick: () => handleSubmitForValidation(),
            variant: 'warning',
          }
        );
      }

      // Actions for rejected status
      if (selectedPlan.statut === 'rejeté' && userInfo.role == 'service_formation') {
        actions.push({
          label: 'Remettre en Brouillon',
          icon: <FaUndo className='me-1' />,
          onClick: () => handleResetPlan(),
          variant: 'warning',
        });
      }
    }

    return actions;
  };
  console.log('userInfo', userInfo);
  // // Authorization check
  if (!userInfo) {
    return <Loader />;
  }

  if (!['service_formation', 'admin'].includes(userInfo.role)) {
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
      render: value =>
        value ? (
          <span title={value}>{value.length > 50 ? `${value.substring(0, 50)}...` : value}</span>
        ) : (
          'Aucune note'
        ),
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
          title='Élaboration du Plan Annuel'
          data={plans}
          columns={columns}
          loading={loading}
          actions={getActions()}
          selectable={userInfo.role == 'service_formation'}
          selectedItems={selectedPlans.map(plan => plans.findIndex(p => p.id === plan.id))}
          onSelectionChange={handleSelectionChange}
          searchable={true}
          searchPlaceholder='Rechercher un plan...'
          emptyMessage='Aucun plan trouvé'
          loadingMessage='Chargement des plans...'
          exportable={true}
          exportFilename='plans-formation'
          pageSize={10}
          showPagination={true}
          hover={true}
          striped={true}
          responsive={true}
        />

        {/* Create Plan Modal */}
        <CreatePlanModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSave={handleCreatePlanSubmit}
          loading={loading}
        />

        {/* Plan Details Modal */}
        <PlanDetailsModal
          show={showDetailsModal}
          onHide={() => {
            setShowDetailsModal(false);
            setCurrentPlanDetails(null);
          }}
          plan={currentPlanDetails}
          onAddFormation={() => handleAddFormation(currentPlanDetails)}
          onRemoveFormation={handleRemoveFormation}
          onSubmitForValidation={() => handleSubmitForValidation(currentPlanDetails)}
          loading={loading}
          userInfo={userInfo}
        />

        {/* Add Formation Modal */}
        <AddFormationModal
          show={showAddFormationModal}
          onHide={() => {
            setShowAddFormationModal(false);
            setCurrentPlan(null);
          }}
          plan={currentPlan}
          availableFormations={availableFormations}
          formationsLoading={formationsLoading}
          onSave={handleAddFormationSubmit}
          loading={loading}
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
          onConfirm={handleConfirmAction}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default GestionPlanServiceFormation;
