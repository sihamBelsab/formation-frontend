import Table from '../components/common/Table';
import { AddUserModal } from '../components/GestionComptes/AddUserModal';
import { EditUserModal } from '../components/GestionComptes/EditUserModal';
import { useGestionComptes } from '../hooks/useGestionComptes';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const GestionComptes = ({ userInfo }) => {
  //Récupération des Outils (Hook)
  const {
    data,
    rowToUpdate,
    showForm,
    showUpdateModal,
    selectedRows,
    loading,
    emptyRowTemplate,
    setShowForm,
    setShowUpdateModal,
    setRowToUpdate,
    setSelectedRows,
    handleAddRow,
    handleUpdateSave,
    handleDeleteSelected,
    generateEmail,
  } = useGestionComptes();

  const allowedRoles = ['admin', 'service_formation', 'directeur_rh', 'directeur_general'];
  const allowedEditRoles = ['service_formation', 'admin'];

  if (!userInfo) {
    return <Loader />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Error message="Vous n'avez pas accès à cette page" showHomeLink={true} />;
  }

  const handleUpdateClick = () => {
    if (selectedRows.length !== 1) {
      alert('Veuillez sélectionner exactement une ligne à modifier.');
      return;
    }
    const rowIndex = selectedRows[0];
    setRowToUpdate({ ...data[rowIndex], index: rowIndex });
    setShowUpdateModal(true);
  };

  // Column configuration for the table
  const columns = [
    {
      key: 'matricule',
      label: 'Matricule',
      sortable: true,
    },
    {
      key: 'nom',
      label: 'Nom',
      sortable: true,
    },
    {
      key: 'prenom',
      label: 'Prénom',
      sortable: true,
    },
    {
      key: 'tel',
      label: 'Téléphone',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: value => {
        if (!value) return 'N/A';
        return (
          <a href={`mailto:${value}`} className='text-primary'>
            {value}
          </a>
        );
      },
    },
    {
      key: 'role',
      label: 'Rôle',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Statut',
      render: value => (
        <span className={`badge ${value === 'actif' ? 'bg-success' : 'bg-secondary'}`}>
          {value === 'actif' ? '✓' : '✗'}
        </span>
      ),
    },
  ];

  // Action buttons for the table
  const getActions = () => {
    if (!allowedEditRoles.includes(userInfo.role)) return [];

    return [
      {
        label: 'Ajouter',
        icon: <FaPlus className='me-1' />,
        onClick: () => setShowForm(true),
        variant: 'success',
      },
      {
        label: 'Modifier',
        icon: <FaEdit className='me-1' />,
        onClick: handleUpdateClick,
        disabled: selectedRows.length !== 1,
        variant: 'primary',
      },
      {
        label: 'Supprimer',
        icon: <FaTrash className='me-1' />,
        onClick: handleDeleteSelected,
        disabled: selectedRows.length === 0,
        variant: 'danger',
      },
    ];
  };

  const actions = getActions();

  const handleSelectionChange = newSelection => {
    setSelectedRows(newSelection);
  };

  return (
    <div className='main-content'>
      <div className='container-fluid'>
        <Table
          title={
            <span>
              <i className='bi bi-people-fill me-2' title='Liste des employés'></i>
              Comptes Utilisateurs
            </span>
          }
          data={data}
          columns={columns}
          loading={loading}
          actions={actions}
          selectable={allowedEditRoles.includes(userInfo.role)}
          selectedItems={selectedRows}
          onSelectionChange={handleSelectionChange}
          searchable={true}
          searchPlaceholder='Rechercher un utilisateur...'
          exportable={true}
          exportFilename='comptes_utilisateurs'
          pageSize={4}
          showPagination={true}
          emptyMessage='Aucun utilisateur trouvé'
          loadingMessage='Chargement des utilisateurs...'
        />

        <AddUserModal
          showForm={showForm}
          setShowForm={setShowForm}
          handleAddRow={handleAddRow}
          emptyRowTemplate={emptyRowTemplate}
          generateEmail={generateEmail}
        />

        <EditUserModal
          showUpdateModal={showUpdateModal}
          setShowUpdateModal={setShowUpdateModal}
          rowToUpdate={rowToUpdate}
          handleUpdateSave={handleUpdateSave}
          generateEmail={generateEmail}
        />
      </div>
    </div>
  );
};

export default GestionComptes;
