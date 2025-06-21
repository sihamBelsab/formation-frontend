import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useTrainingNeeds } from '../hooks';
import EmployeeModal from '../components/common/EmployeeModal';
import Table from '../components/common/Table';
import TrainingNeedForm from '../components/GestionBesion/TrainingNeedForm';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';
const GestionBesoins = ({ userInfo }) => {
  const {
    trainingNeeds,
    directions,
    employees,
    loading,
    error,
    createTrainingNeed,
    updateTrainingNeed,
    deleteMultipleTrainingNeeds,
  } = useTrainingNeeds();

  // State
  const [selectedItems, setSelectedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [currentTrainingNeed, setCurrentTrainingNeed] = useState(null);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  // Table columns
  const columns = [
    {
      key: 'titre',
      label: 'Titre',
      sortable: true,
    },
    {
      key: 'objectif',
      label: 'Objectif',
      render: value => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </div>
      ),
    },
    {
      key: 'dateSouhaitee',
      label: 'Date Souhaitée',
      render: value => (value ? new Date(value).toLocaleDateString('fr-FR') : ''),
      sortable: true,
    },
    {
      key: 'priorite',
      label: 'Priorité',
      render: value => (
        <span
          className={`badge ${
            value === 'Elevée'
              ? 'bg-danger'
              : value === 'Moyenne'
                ? 'bg-warning text-dark'
                : 'bg-success'
          }`}
        >
          {value}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'direction',
      label: 'Direction',
      sortable: true,
    },
    {
      key: 'employees',
      label: 'Employés',
      render: (value, item) => (
        <Button
          variant='outline-primary'
          size='sm'
          onClick={() => handleShowEmployees(item.employees || [])}
          className='d-flex align-items-center gap-1'
          style={{
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '14px',
            padding: '0.25rem 0.5rem',
          }}
        >
          <i className='bi bi-people-fill me-1'></i>
          <span className='badge bg-primary rounded-pill'>{item.employees?.length || 0}</span>
        </Button>
      ),
    },
  ];

  // Event handlers
  function handleShowForm(trainingNeed = null) {
    setCurrentTrainingNeed(trainingNeed);
    setShowForm(true);
  }

  function handleCloseForm() {
    setCurrentTrainingNeed(null);
    setShowForm(false);
  }

  function handleShowEmployees(employees) {
    setCurrentEmployees(employees);
    setShowEmployeeModal(true);
  }

  async function handleSave(formData, id) {
    try {
      setFormLoading(true);
      let result;
      if (id) {
        result = await updateTrainingNeed(id, formData);
      } else {
        result = await createTrainingNeed(formData);
      }
      if (result.success) {
        alert(
          id ? 'Besoin de formation modifié avec succès!' : 'Besoin de formation créé avec succès!'
        );
        handleCloseForm();
        setSelectedItems([]);
      } else {
        alert(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error saving training need:', error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un besoin à supprimer');
      return;
    }
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${selectedItems.length} besoin(s) de formation ?`
    );
    if (confirmed) {
      try {
        const ids = selectedItems.map(index => trainingNeeds[index].idbes);
        const result = await deleteMultipleTrainingNeeds(ids);
        if (result.success) {
          alert('Besoin(s) supprimé(s) avec succès!');
          setSelectedItems([]);
        } else {
          alert(result.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting training needs:', error);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  }

  function handleEdit() {
    if (selectedItems.length !== 1) {
      alert('Veuillez sélectionner exactement un besoin à modifier');
      return;
    }
    handleShowForm(trainingNeeds[selectedItems[0]]);
  }

  // Filter function for search (optional: can be omitted if Table's default search is sufficient)
  const filterFunction = (item, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.titre?.toLowerCase().includes(searchLower) ||
      item.objectif?.toLowerCase().includes(searchLower) ||
      item.priorite?.toLowerCase().includes(searchLower) ||
      item.direction?.toLowerCase().includes(searchLower) ||
      item.dateSouhaitee?.toLowerCase().includes(searchLower)
    );
  };
  const allowedRoles = ['admin', 'responsable_direction'];
  const allowedEditRoles = ['responsable_direction'];

  const getActions = () => {
    if (!allowedEditRoles.includes(userInfo.role)) return [];
    return [
      {
        label: 'Ajouter',
        icon: <i className='bi bi-plus-lg me-1' />,
        onClick: () => handleShowForm(),
        variant: 'success',
      },
      {
        label: 'Modifier',
        icon: <i className='bi bi-pencil-square me-1' />,
        onClick: handleEdit,
        disabled: selectedItems.length !== 1,
        variant: 'warning',
      },
      {
        label: 'Supprimer',
        icon: <i className='bi bi-trash me-1' />,
        onClick: handleDelete,
        disabled: selectedItems.length === 0,
        variant: 'danger',
      },
    ];
  };

  // Actions for the table
  const actions = getActions();
  if (!allowedRoles.includes(userInfo.role)) {
    return (
      <div className='container mt-5'>
        <Error message='Vous êtes pas autorisé à accéder à cette page.' />
      </div>
    );
  }
  if (loading) {
    return (
      <div className='container mt-5'>
        <Loader />
      </div>
    );
  }
  return (
    <div className='container-fluid mt-4' style={{ backgroundColor: '#F9F9F9' }}>
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-4'>
        <div className='d-flex align-items-center gap-2'>
          {/* <span className='badge bg-primary fs-6'>{trainingNeeds.length} besoin(s)</span> */}
          {selectedItems.length > 0 && (
            <span className='badge bg-warning text-dark fs-6'>
              {selectedItems.length} sélectionné(s)
            </span>
          )}
        </div>
      </div>

      {error && (
        <Alert variant='danger' className='alert error'>
          {error}
        </Alert>
      )}

      <Table
        title={
          <span>
            <i className='bi bi-book me-2' title='Liste des employés'></i>
            Besoins en formations
          </span>
        }
        data={trainingNeeds}
        columns={columns}
        loading={loading}
        actions={actions}
        selectable={allowedEditRoles.includes(userInfo.role)}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        searchable={true}
        searchPlaceholder='Rechercher par titre, objectif, priorité ou direction...'
        emptyMessage='Aucun besoin de formation trouvé'
        loadingMessage='Chargement des besoins de formation...'
        exportable={true}
        exportFilename='besoins_formation'
        pageSize={10}
        showPagination={true}
        filterFunction={filterFunction}
      />

      <TrainingNeedForm
        show={showForm}
        onHide={handleCloseForm}
        onSave={handleSave}
        trainingNeed={currentTrainingNeed}
        directions={directions}
        employees={employees}
        loading={formLoading}
      />

      <EmployeeModal
        show={showEmployeeModal}
        onHide={() => setShowEmployeeModal(false)}
        employees={currentEmployees}
        title='Employés concernés par ce besoin'
      />
    </div>
  );
};

export default GestionBesoins;
