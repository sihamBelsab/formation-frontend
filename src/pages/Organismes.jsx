import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocations } from '../hooks';
import DataTable from '../components/all/common/DataTable';
import SearchForm from '../components/all/common/SearchForm';
import LocationForm from '../components/all/common/LocationForm';
import Table from '../components/common/Table';
const Organismes = ({ allowedEdit }) => {
  const { locations, loading, error, createLocation, updateLocation, deleteMultipleLocations } =
    useLocations();

  // Component state
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Table configuration
  const columns = [
    {
      key: 'libelle',
      label: 'Libellé',
      sortable: true,
    },
    {
      key: 'numtel',
      label: 'Téléphone',

      sortable: true,
    },
    {
      key: 'adresse',
      label: 'Adresse',

      sortable: true,
    },
    {
      key: 'budget',
      label: 'Budget',

      sortable: true,
    },
  ];

  // Styles
  const buttonStyle = {
    backgroundColor: '#ffffff',
    color: '#254a67',
    fontWeight: 'bold',
    fontSize: '12px',
    padding: '6px 12px',
    boxShadow: '2px 2px 4px rgba(31, 24, 24, 0.1)',
    transition: 'background-color 0.3s',
    border: '2px solid #11597e',
    borderRadius: '5px',
  };

  const iconStyle = {
    color: '#00008B',
    marginRight: '8px',
    fontSize: '14px',
  };

  // Event handlers
  const handleShowForm = (location = null) => {
    setCurrentLocation(location);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setCurrentLocation(null);
    setShowForm(false);
  };

  const handleSave = async (formData, id) => {
    try {
      setFormLoading(true);
      console.log(formData);
      let result;
      if (id) {
        result = await updateLocation(id, formData);
      } else {
        result = await createLocation(formData);
      }

      if (result.success) {
        alert(id ? 'Lieu modifié avec succès!' : 'Lieu créé avec succès!');
        handleCloseForm();
        setSelectedItems([]);
      } else {
        alert(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un lieu à supprimer');
      return;
    }

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${selectedItems.length} lieu(x) de formation ?`
    );

    if (confirmed) {
      try {
        const ids = selectedItems.map(index => locations[index].id);
        const result = await deleteMultipleLocations(ids);

        if (result.success) {
          alert('Lieu(x) supprimé(s) avec succès!');
          setSelectedItems([]);
        } else {
          alert(result.error || 'Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting locations:', error);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleEdit = () => {
    if (selectedItems.length !== 1) {
      alert('Veuillez sélectionner exactement un lieu à modifier');
      return;
    }
    handleShowForm(locations[selectedItems[0]]);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Libellé,Téléphone,Adresse,Budget\n';
    const csvRows = locations
      .map(
        location =>
          `"${location.libelle}","${location.numtel}","${location.adresse}","${location.budget}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lieux_formation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom actions for the table

  // Filter function for search
  const filterFunction = (item, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.libelle?.toLowerCase().includes(searchLower) ||
      item.numtel?.toLowerCase().includes(searchLower) ||
      item.adresse?.toLowerCase().includes(searchLower) ||
      item.budget?.toString().toLowerCase().includes(searchLower)
    );
  };

  const actions = allowedEdit
    ? [
        {
          label: 'Ajouter',
          icon: <i className='bi bi-plus-lg' />,
          onClick: () => handleShowForm(),
          variant: 'success',
        },
        {
          label: 'Modifier',
          icon: <i className='bi bi-pencil-square' />,
          onClick: handleEdit,
          variant: 'warning',
        },
        {
          label: 'Supprimer',
          icon: <i className='bi bi-trash' />,
          onClick: handleDelete,
          variant: 'danger',
        },
      ]
    : [];

  if (error) {
    return (
      <div className='container-fluid mt-4'>
        <div className='alert alert-danger' role='alert'>
          <i className='bi bi-exclamation-triangle-fill me-2'></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='container-fluid mt-4' style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-4'>
        {/* <h3 className='mb-0' style={{ color: '#2D499B' }}>
          <i className='bi bi-geo-alt me-2'></i>
          Lieux de Formation
        </h3> */}

        <div className='d-flex align-items-center gap-2'>
          {/* <span className='badge bg-primary fs-6'>{locations.length} lieu(x)</span> */}
          {selectedItems.length > 0 && (
            <span className='badge bg-warning text-dark fs-6'>
              {selectedItems.length} sélectionné(s)
            </span>
          )}
        </div>
      </div>

      {/* Data Table */}
      <Table
        title='Lieux de formation'
        data={locations}
        columns={columns}
        loading={loading}
        actions={actions}
        selectable={allowedEdit}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        searchTerm={searchTerm}
        searchPlaceholder='Rechercher un lieu '
        onSearchChange={setSearchTerm}
        filterFunction={filterFunction}
        emptyMessage='Aucun lieu de formation trouvé'
        loadingMessage='Chargement des lieux de formation...'
        pageSize={12}
        showPagination={true}
        exportable={true}
        exportFilename='lieux_formation'
      />

      {/* Location Form Modal */}
      <LocationForm
        show={showForm}
        onHide={handleCloseForm}
        onSave={handleSave}
        location={currentLocation}
        loading={formLoading}
      />
    </div>
  );
};

export default Organismes;
