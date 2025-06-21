import React, { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useEmployees, useDirections, usePositions, useUsers } from '../hooks';
import Table from '../components/common/Table';
import EmployeeForm from '../components/GestionEmployee/EmployeeForm';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';
const GestionEmploye = ({ userInfo }) => {
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const { directions, loading: directionsLoading } = useDirections();
  const { positions, loading: positionsLoading } = usePositions();
  const { users } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleSelectionChange = selectedIndices => {
    const selectedObjects = selectedIndices.map(index => employees[index]);
    setSelectedEmployees(selectedObjects);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    if (selectedEmployees.length !== 1) return;
    const employeeToEdit = selectedEmployees[0];
    if (employeeToEdit) {
      const cleanEmployee = {
        matricule: employeeToEdit.matricule,
        grade: employeeToEdit.grade,
        id_direction: employeeToEdit.id_direction?.toString(),
        id_poste: employeeToEdit.id_poste?.toString(),
      };
      setEditingEmployee(cleanEmployee);
      setShowForm(true);
    }
  };

  const handleSave = async formData => {
    try {
      const result = editingEmployee
        ? await updateEmployee(editingEmployee.matricule, formData)
        : await createEmployee(formData);

      if (result.success) {
        setShowForm(false);
        setEditingEmployee(null);
        setSelectedEmployees([]);
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEmployees.length === 0) {
      alert('Veuillez sélectionner au moins un employé');
      return;
    }

    if (
      !window.confirm(`Voulez-vous vraiment supprimer ${selectedEmployees.length} employé(s) ?`)
    ) {
      return;
    }

    try {
      for (const employee of selectedEmployees) {
        await deleteEmployee(employee.matricule);
      }
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error deleting employees:', error);
    }
  };
  const allowedRoles = ['admin', 'service_formation'];
  const allowedEditRoles = ['service_formation'];

  const getActions = () => {
    if (!allowedEditRoles.includes(userInfo.role)) return [];

    return [
      {
        label: 'Ajouter',
        icon: <FaPlus className='me-1' />,
        onClick: handleAdd,
        variant: 'success',
      },
      {
        label: 'Modifier',
        icon: <FaEdit className='me-1' />,
        onClick: handleEdit,
        disabled: selectedEmployees.length !== 1,
        variant: 'primary',
      },
      {
        label: 'Supprimer',
        icon: <FaTrash className='me-1' />,
        onClick: handleDeleteSelected,
        disabled: selectedEmployees.length === 0,
        variant: 'danger',
      },
    ];
  };

  const actions = getActions();
  if (!userInfo) {
    return <Loader />;
  }
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Error message="Vous n'avez pas accès à cette page" showHomeLink={true} />;
  }
  const columns = [
    { key: 'matricule', label: 'Matricule', sortable: true },
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: value =>
        value ? (
          <a href={`mailto:${value}`} className='text-primary'>
            {value}
          </a>
        ) : (
          'N/A'
        ),
    },
    {
      key: 'tel',
      label: 'Téléphone',
      render: value =>
        value ? (
          <a href={`tel:${value}`} className='text-primary'>
            {value}
          </a>
        ) : (
          'N/A'
        ),
    },
    { key: 'poste', label: 'Poste', sortable: true },
    { key: 'grade', label: 'Grade', sortable: true },
    { key: 'direction', label: 'Direction', sortable: true },
  ];

  return (
    <div className='main-content'>
      <div className='container-fluid'>
        {employeesError && (
          <Alert variant='danger' className='alert error'>
            {employeesError}
          </Alert>
        )}

        <Table
          title={
            <span>
              <i className='bi bi-people-fill me-2' title='Liste des employés'></i>
              Liste des employés
            </span>
          }
          data={employees}
          columns={columns}
          loading={employeesLoading}
          actions={actions}
          selectable={allowedEditRoles.includes(userInfo.role)}
          selectedItems={selectedEmployees.map(emp =>
            employees.findIndex(e => e.matricule === emp.matricule)
          )}
          onSelectionChange={handleSelectionChange}
          searchable={true}
          searchPlaceholder='Rechercher un employé...'
          emptyMessage='Aucun employé trouvé'
          loadingMessage='Chargement des employés...'
          exportable={true}
          exportFilename='employes'
          pageSize={10}
          showPagination={true}
          hover={true}
          striped={true}
          responsive={true}
        />

        <EmployeeForm
          show={showForm}
          onHide={() => {
            setShowForm(false);
            setEditingEmployee(null);
            setSelectedEmployees([]);
          }}
          employee={editingEmployee}
          onSave={handleSave}
          loading={employeesLoading}
          employees={employees}
          users={users}
          directions={directions}
          positions={positions}
          directionsLoading={directionsLoading}
          positionsLoading={positionsLoading}
        />
      </div>
    </div>
  );
};

export default GestionEmploye;
