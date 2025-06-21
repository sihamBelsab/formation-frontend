import React, { useState } from 'react';
import { Card, Button, Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainerSchema } from '../utils/formValidation';
import { PhoneField } from '../components/common/FormUtils';
import { useTrainers } from '../hooks';
import DataTable from '../components/all/common/DataTable';
import SearchForm from '../components/all/common/SearchForm';
import '../styles/forms.css';
// Trainer Form Component
const TrainerForm = ({ show, onHide, trainer = null, onSave, loading }) => {
  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    resolver: zodResolver(trainerSchema),
    mode: 'onChange',
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    },
  });

  // Update form when trainer changes (for editing)
  React.useEffect(() => {
    if (trainer) {
      form.reset({
        idformateur: trainer.idformateur || '',
        nom: trainer.nom || '',
        prenom: trainer.prenom || '',
        email: trainer.email || '',
        telephone: trainer.telephone || '',
      });
    } else {
      form.reset({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
      });
    }
    setSubmitError('');
  }, [trainer, show, form]);

  const handleCancel = () => {
    form.reset();
    setSubmitError('');
    onHide();
  };

  const onSubmit = async data => {
    setSubmitError('');

    try {
      const result = await onSave(data);

      if (result?.success !== false) {
        form.reset();
        setSubmitError('');
      } else {
        setSubmitError(result?.message || "Une erreur est survenue lors de l'enregistrement");
      }
    } catch (error) {
      console.error('Error saving trainer:', error);
      setSubmitError(error?.message || "Une erreur est survenue lors de l'enregistrement");
    }
  };

  const canSubmit = form.formState.isValid && !loading;

  return (
    <Modal show={show} onHide={handleCancel} size='lg' backdrop='static' keyboard={false}>
      <Modal.Header closeButton className='modal-header'>
        <Modal.Title className='modal-title'>
          <FaUserTie className='me-2' />
          {trainer ? 'Modifier le formateur' : 'Nouveau formateur'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          {submitError && (
            <Alert variant='danger' dismissible onClose={() => setSubmitError('')}>
              <i className='bi bi-exclamation-triangle me-2'></i>
              {submitError}
            </Alert>
          )}

          {/* {import.meta.env.DEV && (
            <Alert variant='info' className='small mb-3'>
              <strong>🔧 Debug:</strong> Valid: {form.formState.isValid ? '✅' : '❌'} | Dirty:{' '}
              {form.formState.isDirty ? '✅' : '❌'} | Can Submit: {canSubmit ? '✅' : '❌'} |
              Errors: {Object.keys(form.formState.errors).length}
            </Alert>
          )} */}

          <Row>
            <Col md={6}>
              <Form.Group className='form-group'>
                <Form.Label className='form-label required'>Nom</Form.Label>
                <Form.Control
                  type='text'
                  {...form.register('nom')}
                  className={`form-control ${form.formState.errors.nom ? 'is-invalid' : ''}`}
                  placeholder='Saisir le nom'
                  disabled={loading}
                />
                {form.formState.errors.nom && (
                  <div className='text-danger small mt-1'>
                    <i className='bi bi-exclamation-circle me-1'></i>
                    {form.formState.errors.nom.message}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className='form-group'>
                <Form.Label className='form-label required'>Prénom</Form.Label>
                <Form.Control
                  type='text'
                  {...form.register('prenom')}
                  className={`form-control ${form.formState.errors.prenom ? 'is-invalid' : ''}`}
                  placeholder='Saisir le prénom'
                  disabled={loading}
                />
                {form.formState.errors.prenom && (
                  <div className='text-danger small mt-1'>
                    <i className='bi bi-exclamation-circle me-1'></i>
                    {form.formState.errors.prenom.message}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className='form-group'>
                <Form.Label className='form-label required'>Email</Form.Label>
                <Form.Control
                  type='email'
                  {...form.register('email')}
                  className={`form-control ${form.formState.errors.email ? 'is-invalid' : ''}`}
                  placeholder="Saisir l'email"
                  disabled={loading}
                />
                {form.formState.errors.email && (
                  <div className='text-danger small mt-1'>
                    <i className='bi bi-exclamation-circle me-1'></i>
                    {form.formState.errors.email.message}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <PhoneField
                label='Téléphone'
                name='telephone'
                placeholder='Ex: 0123456789'
                register={form.register}
                error={form.formState.errors.telephone}
                required
                disabled={loading}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-end gap-3'>
          <Button variant='secondary' onClick={handleCancel} disabled={loading} className='px-4'>
            Annuler
          </Button>
          <Button type='submit' variant='primary' disabled={loading || !canSubmit} className='px-4'>
            {loading ? (
              <>
                <span
                  className='spinner-border spinner-border-sm me-2'
                  role='status'
                  aria-hidden='true'
                ></span>
                {trainer ? 'Modification...' : 'Ajout...'}
              </>
            ) : trainer ? (
              'Modifier'
            ) : (
              'Ajouter'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Main Formateurs Component
const Formateurs = ({ allowedEdit }) => {
  const { trainers, loading, error, createTrainer, updateTrainer, deleteTrainer } = useTrainers();

  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Table columns configuration
  const columns = [
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
      key: 'email',
      label: 'Email',
      render: item => (
        <a href={`mailto:${item.email}`} className='text-primary text-decoration-none'>
          {item.email}
        </a>
      ),
      sortable: true,
    },
    {
      key: 'telephone',
      label: 'Téléphone',
      render: item => (
        <a href={`tel:${item.telephone}`} className='text-primary text-decoration-none'>
          {item.telephone}
        </a>
      ),
      sortable: true,
    },
  ];

  // Filter function for search
  const filterFunction = (item, searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.nom?.toLowerCase().includes(searchLower) ||
      item.prenom?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.telephone?.toLowerCase().includes(searchLower)
    );
  };

  // Handlers
  const handleAdd = () => {
    setEditingTrainer(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    if (selectedItems.length !== 1) {
      alert('Veuillez sélectionner exactement un formateur à modifier');
      return;
    }
    const trainer = trainers[selectedItems[0]];
    setEditingTrainer(trainer);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      alert('Veuillez sélectionner au moins un formateur à supprimer');
      return;
    }

    if (!window.confirm(`Voulez-vous vraiment supprimer ${selectedItems.length} formateur(s) ?`)) {
      return;
    }

    try {
      for (const index of selectedItems) {
        const trainer = trainers[index];
        await deleteTrainer(trainer.idformateur);
      }
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting trainers:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async formData => {
    let result;
    console.log(formData);
    if (editingTrainer) {
      result = await updateTrainer(formData.idformateur, formData);
    } else {
      result = await createTrainer(formData);
    }

    if (result.success) {
      setShowForm(false);
      setEditingTrainer(null);
    }
  };

  const handleExportCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = trainers
      .map(trainer => columns.map(col => trainer[col.key] || '').join(','))
      .join('\n');

    const csvContent = headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formateurs.csv';
    link.click();
  };

  return (
    <div className='main-content'>
      <div className='container-fluid'>
        <h1 className='page-title text-custom-blue fs-4'>Gestion des formateurs</h1>

        {error && (
          <Alert variant='danger' className='alert error'>
            {error}
          </Alert>
        )}

        <Card className='table-container'>
          <Card.Body>
            {/* Action Bar */}
            <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3'>
              <div className='d-flex gap-2 flex-wrap'>
                {allowedEdit && (
                  <>
                    <Button
                      className='action-button success'
                      onClick={handleAdd}
                      disabled={loading}
                    >
                      <FaPlus className='me-1' />
                      Ajouter
                    </Button>
                    <Button
                      className='action-button primary'
                      onClick={handleEdit}
                      disabled={loading || selectedItems.length !== 1}
                    >
                      <FaEdit className='me-1' />
                      Modifier
                    </Button>

                    <Button
                      className='action-button danger'
                      onClick={handleDelete}
                      disabled={loading || selectedItems.length === 0}
                    >
                      <FaTrash className='me-1' />
                      Supprimer ({selectedItems.length})
                    </Button>
                  </>
                )}
              </div>

              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {/* Bouton Exporter à gauche */}
                <Button className='action-button' onClick={handleExportCSV} disabled={loading}>
                  <FaDownload className='me-1' />
                  Exporter CSV
                </Button>

                {/* Barre de recherche à droite */}
                <div style={{ minWidth: '300px' }}>
                  <SearchForm
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder='Rechercher un formateur...'
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title='Gestion des formateurs'
              data={trainers}
              columns={columns}
              loading={loading}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              searchTerm={searchTerm}
              filterFunction={filterFunction}
              selectable={allowedEdit}
              emptyMessage='Aucun formateur trouvé'
              loadingMessage='Chargement des formateurs...'
              showPagination={false}
            />

            {/* Stats */}
            <div className='mt-3 text-muted'>
              <small>
                {trainers.length} formateur(s) total
                {selectedItems.length > 0 && ` • ${selectedItems.length} sélectionné(s)`}
              </small>
            </div>
          </Card.Body>
        </Card>

        {/* Form Modal */}
        <TrainerForm
          show={showForm}
          onHide={() => setShowForm(false)}
          trainer={editingTrainer}
          onSave={handleSave}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Formateurs;
