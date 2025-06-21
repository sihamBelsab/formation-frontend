import React from 'react';
import { Modal, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash, FaPaperPlane } from 'react-icons/fa';

const PlanDetailsModal = ({
  show,
  onHide,
  plan,
  onAddFormation,
  onRemoveFormation,
  onSubmitForValidation,
  loading = false,
  userInfo,
}) => {
  if (!plan) return null;

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

  const calculateTotalBudget = () => {
    if (!plan.formations) return 0;
    return plan.formations.reduce(
      (total, formation) => total + (parseFloat(formation.budget) || 0),
      0
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered size='xl'>
      <Modal.Header closeButton>
        <Modal.Title>
          Détails du Plan de Formation {plan.annee}
          <Badge bg='secondary' className='ms-2'>
            {getStatusBadge(plan.statut)}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-4'>
          <h5>Informations Générales</h5>
          <div className='row'>
            <div className='col-md-6'>
              <p>
                <strong>Année:</strong> {plan.annee}
              </p>
              <p>
                <strong>Statut:</strong> {getStatusBadge(plan.statut)}
              </p>
            </div>
            <div className='col-md-6'>
              <p>
                <strong>Budget Total:</strong> {parseFloat(plan.totalBudget).toLocaleString()} DA
              </p>
              <p>
                <strong>Nombre de Formations:</strong> {plan.formations?.length || 0}
              </p>
            </div>
          </div>
          {plan.notes && (
            <div className='mt-3'>
              <h6>Notes:</h6>
              <p className='text-muted'>{plan.notes}</p>
            </div>
          )}
        </div>

        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5>Formations Planifiées</h5>
          {plan.statut === 'brouillon' && userInfo.role == 'service_formation' && (
            <Button variant='primary' size='sm' onClick={onAddFormation} disabled={loading}>
              <FaPlus className='me-1' />
              Ajouter Formation
            </Button>
          )}
        </div>

        {plan.formations && plan.formations.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Thème</th>
                <th>Dates</th>
                <th>Type</th>
                <th>Catégorie</th>
                <th>Budget</th>
                {plan.statut === 'brouillon' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {plan.formations.map(formation => (
                <tr key={formation.id}>
                  <td>{formation.theme}</td>
                  <td>
                    {new Date(formation.date_debut).toLocaleDateString()} -{' '}
                    {new Date(formation.date_fin).toLocaleDateString()}
                  </td>
                  <td>{formation.type}</td>
                  <td>{formation.categorie}</td>
                  <td>{parseFloat(formation.budget).toLocaleString()} DA</td>
                  {plan.statut === 'brouillon' && (
                    <td>
                      <Button
                        variant='danger'
                        size='sm'
                        onClick={() => onRemoveFormation(formation.id_formation)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className='text-center py-4'>
            <p className='text-muted'>Aucune formation planifiée</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide} disabled={loading}>
          Fermer
        </Button>
        {plan.statut === 'brouillon' && plan.formations && plan.formations.length > 0 && (
          <Button variant='primary' onClick={onSubmitForValidation} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                  className='me-2'
                />
                Soumission...
              </>
            ) : (
              <>
                <FaPaperPlane className='me-1' />
                Soumettre pour Validation
              </>
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PlanDetailsModal;
