import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormations } from '../hooks/useFormations';
import { formationSchema } from '../utils/formValidation';
import Table from '../components/common/Table';
import { Modal, Button, Form } from 'react-bootstrap';
import SearchableSelect from '../components/common/SearchableSelect';
import EmployeeModal from '../components/common/EmployeeModal';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';
import '../styles/forms.css';
import { FormDebugPanel } from '../components/common/FormUtils';

const GestionForma = ({ userInfo }) => {
  const {
    formations,
    besoins,
    organismes,
    formateurs,
    loading,
    selectedRows,
    setSelectedRows,
    showForm,
    setShowForm,
    showUpdateModal,
    setShowUpdateModal,
    handleAddRow,
    handleDeleteSelected,
    emptyRowTemplate,
    handleUpdateRow,
  } = useFormations();

  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form with React Hook Form
  const createForm = useForm({
    resolver: zodResolver(formationSchema),
    mode: 'onChange',
    defaultValues: emptyRowTemplate,
  });

  // Update form
  const updateForm = useForm({
    resolver: zodResolver(formationSchema),
    mode: 'onChange',
  });

  // Handle create form submission
  const onCreateSubmit = async data => {
    setIsSubmitting(true);
    try {
      const transformedData = transformFormationData(data);
      await handleAddRow(transformedData);
      setShowForm(false);
      createForm.reset(emptyRowTemplate);
    } catch (error) {
      console.error('Error adding formation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update form submission
  const onUpdateSubmit = async data => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const transformedData = updateTransformFormationData(data);
      await handleUpdateRow(transformedData);
      setShowUpdateModal(false);
      updateForm.reset();
    } catch (error) {
      console.error('Error updating formation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform data for backend (keeping existing logic)
  const transformFormationData = data => {
    const transformed = {
      categorie: data.categorie,
      type: data.type,
      date_debut: data.date_debut,
      date_fin: data.date_fin,
      etat: data.etat || 'encours',
      idformateur: data.idformateur,
      theme: data.theme,
      idbes: data.idbes,
      id_formation: data.id_formation,
      id: data.id,
    };

    // Apply existing transformation logic
    const validCategories = ['metier', 'transverse', 'ordre légale'];
    const validTypes = ['interne', 'externe'];
    const validEtats = ['realisé', 'encours', 'reporteé', 'annuleé'];

    if (transformed.categorie && !validCategories.includes(transformed.categorie)) {
      delete transformed.categorie;
    }
    if (transformed.type && !validTypes.includes(transformed.type)) {
      delete transformed.type;
    }
    if (transformed.etat && !validEtats.includes(transformed.etat)) {
      transformed.etat = 'encours';
    }

    if (transformed.idformateur) {
      transformed.idformateur = parseInt(transformed.idformateur, 10);
    }
    if (transformed.idbes) {
      transformed.idbes = parseInt(transformed.idbes, 10);
    }
    if (transformed.id) {
      transformed.id = parseInt(transformed.id, 10);
    }

    Object.keys(transformed).forEach(key => {
      if (transformed[key] === undefined || transformed[key] === null || transformed[key] === '') {
        delete transformed[key];
      }
    });

    Object.keys(transformed).forEach(key => {
      if (typeof transformed[key] === 'object' && transformed[key] !== null) {
        delete transformed[key];
      }
    });

    if (transformed.date_debut) {
      transformed.date_debut = new Date(transformed.date_debut).toISOString().split('T')[0];
    }
    if (transformed.date_fin) {
      transformed.date_fin = new Date(transformed.date_fin).toISOString().split('T')[0];
    }

    return transformed;
  };

  const updateTransformFormationData = data => {
    return {
      id_formation: data.id_formation,
      categorie: data.categorie,
      type: data.type,
      date_debut: data.date_debut,
      date_fin: data.date_fin,
      etat: data.etat || 'encours',
      idformateur: data.formateur?.idformateur || data.idformateur,
      theme: data.theme,
      idbes: parseInt(data.idbes, 10),
      id: parseInt(data.id, 10),
    };
  };

  const mapAndSetEmployees = employees => {
    const employeesList = employees.map(employee => ({
      ...employee,
      nom: employee.utilisateur.nom,
      prenom: employee.utilisateur.prenom,
    }));
    setCurrentEmployees(employeesList);
    setShowEmployeeModal(true);
  };

  // Handle close create modal
  const handleCloseCreateModal = () => {
    setShowForm(false);
    createForm.reset(emptyRowTemplate);
  };

  // Handle close update modal
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    updateForm.reset();
  };

  // Table columns (keeping existing)
  const columns = [
    {
      key: 'besoin_titre',
      label: 'Titre formation',
      sortable: true,
      render: (value, item) => item.besoin?.titre || 'N/A',
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      sortable: true,
      render: value => value || 'N/A',
    },
    {
      key: 'type',
      label: 'Type',
      render: value => value || 'N/A',
    },
    {
      key: 'besoin_objectif',
      label: 'Objectif formation',
      render: (value, item) => item.besoin?.objectif || 'N/A',
    },
    {
      key: 'besoin_direction',
      label: 'Direction concernée',
      sortable: true,
      render: (value, item) => item.besoin?.direction || 'N/A',
    },
    {
      key: 'date_debut',
      label: 'Date début',
      sortable: true,
      render: value => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'date_fin',
      label: 'Date fin',
      sortable: true,
      render: value => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'lieu_libelle',
      label: 'Organisme',
      sortable: true,
      render: (value, item) => item.lieu?.libelle || 'N/A',
    },
    {
      key: 'formateur_nom',
      label: 'Formateur',
      sortable: true,
      render: (value, item) =>
        item.formateur ? `${item.formateur.nom} ${item.formateur.prenom}` : 'N/A',
    },
    {
      key: 'etat',
      label: 'État',
      sortable: true,
      render: value => value || 'N/A',
    },
    {
      key: 'theme',
      label: 'Thème',
      render: value => value || 'N/A',
    },
    {
      key: 'employees',
      label: 'Employés',
      render: (value, item) => (
        <button
          className='btn btn-outline-primary btn-sm d-flex align-items-center gap-1'
          onClick={() => mapAndSetEmployees(item.employees || [])}
          style={{
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '14px',
            padding: '0.25rem 0.5rem',
          }}
        >
          <i className='bi bi-people-fill me-1'></i>
          <span className='badge bg-primary rounded-pill'>{item.employees?.length || 0}</span>
        </button>
      ),
    },
  ];

  const allowedRoles = ['service_formation', 'directeur_general', 'admin'];
  const allowedEditRoles = ['service_formation'];

  const getActions = () => {
    if (!allowedEditRoles.includes(userInfo.role)) return [];
    return [
      {
        label: 'Ajouter',
        icon: <i className='bi bi-plus-lg' />,
        onClick: () => setShowForm(true),
        variant: 'success',
      },
      {
        label: 'Supprimer',
        icon: <i className='bi bi-trash3' />,
        onClick: handleDeleteSelected,
        disabled: selectedRows.length === 0,
        variant: 'danger',
      },
      {
        label: 'Modifier',
        icon: <i className='bi bi-pencil-square' />,
        onClick: () => {
          if (selectedRows.length !== 1) {
            alert('Veuillez sélectionner exactement une ligne à modifier.');
            return;
          }

          const selectedIndex = selectedRows[0];
          if (selectedIndex < 0 || selectedIndex >= formations.length) {
            alert('Ligne sélectionnée invalide.');
            return;
          }

          const selectedRow = formations[selectedIndex];

          const formatDateForInput = dateString => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          console.log(selectedRow);
          const formattedData = {
            ...selectedRow,
            originalIndex: selectedIndex,
            date_debut: formatDateForInput(selectedRow.date_debut),
            date_fin: formatDateForInput(selectedRow.date_fin),
            idbes: selectedRow.besoin?.idbes?.toString() || '',
            id: selectedRow.lieu?.id?.toString() || '',
            idformateur: selectedRow.formateur?.id?.toString() || '',
          };

          updateForm.reset(formattedData);
          setShowUpdateModal(true);
        },
        disabled: selectedRows.length !== 1,
        variant: 'primary',
      },
    ];
  };

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
  console.log(formations);
  return (
    <div className='container-fluid mt-4' style={{ backgroundColor: '#F9F9F9' }}>
      {formations ? (
        <Table
          title='Suivi et planification des formations'
          data={formations}
          columns={columns}
          loading={loading}
          actions={actions}
          selectable={allowedEditRoles.includes(userInfo.role)}
          selectedItems={selectedRows}
          onSelectionChange={setSelectedRows}
          searchPlaceholder='Rechercher une formation...'
          emptyMessage='Aucune formation trouvée'
          loadingMessage='Chargement des formations...'
          pageSize={12}
          showPagination={true}
          exportable={false}
          exportFilename='formations'
        />
      ) : (
        <div>No data available</div>
      )}

      {showEmployeeModal && (
        <EmployeeModal
          show={showEmployeeModal}
          onHide={() => setShowEmployeeModal(false)}
          employees={currentEmployees}
        />
      )}

      {/* Create Formation Modal */}
      <Modal show={showForm} onHide={handleCloseCreateModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='bi bi-plus-circle me-2'></i>
            Ajouter une Formation
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
          <Modal.Body>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Besoin de formation</Form.Label>
                  <Form.Select
                    {...createForm.register('idbes')}
                    className={
                      createForm.formState.errors.idbes ? 'form-control is-invalid' : 'form-control'
                    }
                  >
                    <option value=''>Sélectionnez un besoin de formation</option>
                    {besoins.map(besoin => (
                      <option key={besoin.idbes} value={besoin.idbes}>
                        {besoin.titre}
                      </option>
                    ))}
                  </Form.Select>
                  {createForm.formState.errors.idbes && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.idbes.message}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Catégorie</Form.Label>
                  <div>
                    {['metier', 'transverse', 'ordre légale'].map(option => (
                      <Form.Check
                        key={option}
                        type='radio'
                        name='categorie'
                        value={option}
                        label={
                          option === 'metier'
                            ? 'Métier'
                            : option === 'transverse'
                              ? 'Transverse'
                              : 'Ordre légale'
                        }
                        {...createForm.register('categorie')}
                        className={createForm.formState.errors.categorie ? 'is-invalid' : ''}
                      />
                    ))}
                  </div>
                  {createForm.formState.errors.categorie && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.categorie.message}
                    </div>
                  )}
                </Form.Group>
              </div>

              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Thème</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Saisir le thème de la formation'
                    {...createForm.register('theme')}
                    className={
                      createForm.formState.errors.theme ? 'form-control is-invalid' : 'form-control'
                    }
                  />
                  {createForm.formState.errors.theme && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.theme.message}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Type</Form.Label>
                  <div>
                    {['interne', 'externe'].map(option => (
                      <Form.Check
                        key={option}
                        type='radio'
                        name='type'
                        value={option}
                        label={option === 'interne' ? 'Interne' : 'Externe'}
                        {...createForm.register('type')}
                        className={createForm.formState.errors.type ? 'is-invalid' : ''}
                      />
                    ))}
                  </div>
                  {createForm.formState.errors.type && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.type.message}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Date début</Form.Label>
                  <Form.Control
                    type='date'
                    {...createForm.register('date_debut')}
                    className={
                      createForm.formState.errors.date_debut
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                  />
                  {createForm.formState.errors.date_debut && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.date_debut.message}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Date fin</Form.Label>
                  <Form.Control
                    type='date'
                    {...createForm.register('date_fin')}
                    className={
                      createForm.formState.errors.date_fin
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                  />
                  {createForm.formState.errors.date_fin && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.date_fin.message}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Organisme</Form.Label>
                  <Form.Select
                    {...createForm.register('id')}
                    className={
                      createForm.formState.errors.id ? 'form-control is-invalid' : 'form-control'
                    }
                  >
                    <option value=''>Sélectionnez un organisme</option>
                    {organismes.map(organisme => (
                      <option key={organisme.id} value={organisme.id}>
                        {organisme.libelle}
                      </option>
                    ))}
                  </Form.Select>
                  {createForm.formState.errors.id && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.id.message}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>État</Form.Label>
                  <Form.Select
                    {...createForm.register('etat')}
                    className={
                      createForm.formState.errors.etat ? 'form-control is-invalid' : 'form-control'
                    }
                  >
                    <option value=''>Sélectionnez un état</option>
                    <option value='realisé'>Réalisé</option>
                    <option value='encours'>En cours</option>
                    <option value='reporteé'>Reporté</option>
                    <option value='annuleé'>Annulée</option>
                  </Form.Select>
                  {createForm.formState.errors.etat && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {createForm.formState.errors.etat.message}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <Form.Group className='mb-3'>
              <Form.Label className='required'>Formateur</Form.Label>
              <Form.Select
                {...createForm.register('idformateur')}
                className={
                  createForm.formState.errors.idformateur
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              >
                <option value=''>Sélectionnez un formateur</option>
                {formateurs.map(formateur => (
                  <option key={formateur.idformateur} value={formateur.idformateur}>
                    {formateur.prenom} {formateur.nom}
                  </option>
                ))}
              </Form.Select>
              {createForm.formState.errors.idformateur && (
                <div className='text-danger small mt-1'>
                  <i className='bi bi-exclamation-circle me-1'></i>
                  {createForm.formState.errors.idformateur.message}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseCreateModal}>
              Annuler
            </Button>
            <Button
              type='submit'
              variant='success'
              disabled={!createForm.formState.isValid || isSubmitting}
            >
              <i className='bi bi-plus-circle me-1'></i>
              {isSubmitting ? 'Ajout...' : 'Ajouter'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Update Formation Modal - Similar structure but simpler */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='bi bi-pencil-square me-2'></i>
            Modifier une Formation
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={updateForm.handleSubmit(onUpdateSubmit)}>
          <FormDebugPanel
            formState={updateForm.formState}
            canSubmit={updateForm.formState.isValid}
          />
          <Modal.Body>
            {/* Similar form structure as create form but with update form */}
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Besoin de formation</Form.Label>
                  <Form.Select
                    {...updateForm.register('idbes')}
                    className={
                      updateForm.formState.errors.idbes ? 'form-control is-invalid' : 'form-control'
                    }
                  >
                    <option value=''>Sélectionnez un besoin de formation</option>
                    {besoins.map(besoin => (
                      <option key={besoin.idbes} value={besoin.idbes}>
                        {besoin.titre}
                      </option>
                    ))}
                  </Form.Select>
                  {updateForm.formState.errors.idbes && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.idbes.message}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Catégorie</Form.Label>
                  <div>
                    {['metier', 'transverse', 'ordre légale'].map(option => (
                      <Form.Check
                        key={option}
                        type='radio'
                        name='categorie'
                        value={option}
                        label={
                          option === 'metier'
                            ? 'Métier'
                            : option === 'transverse'
                              ? 'Transverse'
                              : 'Ordre légale'
                        }
                        {...updateForm.register('categorie')}
                        className={updateForm.formState.errors.categorie ? 'is-invalid' : ''}
                      />
                    ))}
                  </div>
                  {updateForm.formState.errors.categorie && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.categorie.message}
                    </div>
                  )}
                </Form.Group>
              </div>

              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Thème</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Saisir le thème de la formation'
                    {...updateForm.register('theme')}
                    className={
                      updateForm.formState.errors.theme ? 'form-control is-invalid' : 'form-control'
                    }
                  />
                  {updateForm.formState.errors.theme && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.theme.message}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Type</Form.Label>
                  <div>
                    {['interne', 'externe'].map(option => (
                      <Form.Check
                        key={option}
                        type='radio'
                        name='type'
                        value={option}
                        label={option === 'interne' ? 'Interne' : 'Externe'}
                        {...updateForm.register('type')}
                        className={updateForm.formState.errors.type ? 'is-invalid' : ''}
                      />
                    ))}
                  </div>
                  {updateForm.formState.errors.type && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.type.message}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Date début</Form.Label>
                  <Form.Control
                    type='date'
                    {...updateForm.register('date_debut')}
                    className={
                      updateForm.formState.errors.date_debut
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                  />
                  {updateForm.formState.errors.date_debut && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.date_debut.message}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Date fin</Form.Label>
                  <Form.Control
                    type='date'
                    {...updateForm.register('date_fin')}
                    className={
                      updateForm.formState.errors.date_fin
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                  />
                  {updateForm.formState.errors.date_fin && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.date_fin.message}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>Organisme</Form.Label>
                  <Form.Select
                    {...updateForm.register('id')}
                    className={
                      updateForm.formState.errors.id ? 'form-control is-invalid' : 'form-control'
                    }
                  >
                    <option value=''>Sélectionnez un organisme</option>
                    {organismes.map(organisme => (
                      <option key={organisme.id} value={organisme.id}>
                        {organisme.libelle}
                      </option>
                    ))}
                  </Form.Select>
                  {updateForm.formState.errors.id && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.id.message}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group className='mb-3'>
                  <Form.Label className='required'>État</Form.Label>
                  <Form.Select
                    {...updateForm.register('etat')}
                    className={
                      updateForm.formState.errors.etat ? 'form-control is-invalid' : 'form-control'
                    }
                  >
                    <option value=''>Sélectionnez un état</option>
                    <option value='realisé'>Réalisé</option>
                    <option value='encours'>En cours</option>
                    <option value='reporteé'>Reporté</option>
                    <option value='annuleé'>Annulée</option>
                  </Form.Select>
                  {updateForm.formState.errors.etat && (
                    <div className='text-danger small mt-1'>
                      <i className='bi bi-exclamation-circle me-1'></i>
                      {updateForm.formState.errors.etat.message}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <Form.Group className='mb-3'>
              <Form.Label className='required'>Formateur</Form.Label>
              <Form.Select
                {...updateForm.register('idformateur')}
                className={
                  updateForm.formState.errors.idformateur
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              >
                <option value=''>Sélectionnez un formateur</option>
                {formateurs.map(formateur => (
                  <option key={formateur.idformateur} value={formateur.idformateur}>
                    {formateur.prenom} {formateur.nom}
                  </option>
                ))}
              </Form.Select>
              {updateForm.formState.errors.idformateur && (
                <div className='text-danger small mt-1'>
                  <i className='bi bi-exclamation-circle me-1'></i>
                  {updateForm.formState.errors.idformateur.message}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseUpdateModal}>
              Annuler
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={!updateForm.formState.isValid || isSubmitting}
            >
              <i className='bi bi-check-circle me-1'></i>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default GestionForma;
