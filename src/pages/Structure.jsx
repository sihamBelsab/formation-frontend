import React, { useState } from 'react';
import { Tabs, Tab, Card, Form, Button, Table, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { FaBuilding, FaUserTie } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { directionSchema, positionSchema } from '../utils/formValidation';
import { useDirections, usePositions } from '../hooks';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';
import '../styles/forms.css';

// Direction Management Component
const DirectionManagement = ({ role }) => {
  const { directions, loading, error, createDirection, updateDirection, deleteDirection } =
    useDirections();

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form for adding new directions
  const addForm = useForm({
    resolver: zodResolver(directionSchema),
    mode: 'onChange',
    defaultValues: { direction: '' },
  });

  // Form for editing directions
  const editForm = useForm({
    resolver: zodResolver(directionSchema),
    mode: 'onChange',
    defaultValues: { direction: '' },
  });

  const handleAdd = async data => {
    const result = await createDirection(data);
    if (result.success) {
      addForm.reset();
    }
  };

  const handleEdit = direction => {
    setEditingId(direction.idDirection);
    editForm.reset({ direction: direction.direction });
  };

  const handleSave = async data => {
    const result = await updateDirection(editingId, data);
    if (result.success) {
      setEditingId(null);
      editForm.reset();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    editForm.reset();
  };

  const handleDelete = async id => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette direction ?')) return;
    await deleteDirection(id);
  };

  const filteredDirections = directions.filter(
    dir => dir.direction && dir.direction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <InputGroup className='mb-3'>
        <Form.Control
          type='text'
          placeholder='Rechercher une direction...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='ps-5' // padding-left pour laisser la place à la loupe
          style={{ position: 'relative' }}
        />
        <BsSearch
          style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6c757d', // couleur grise Bootstrap
            pointerEvents: 'none', // pour que l'utilisateur puisse cliquer dans l'input
          }}
        />
      </InputGroup>

      {/* Add Form */}
      {role === 'service_formation' && (
        <Form onSubmit={addForm.handleSubmit(handleAdd)} className='mb-3'>
          <InputGroup>
            <Form.Control
              placeholder='Ajouter une direction '
              {...addForm.register('direction')}
              className={addForm.formState.errors.direction ? 'is-invalid' : ''}
              disabled={loading}
            />
            <Button
              type='submit'
              className='action-button success'
              disabled={loading || !addForm.formState.isValid}
            >
              {loading ? <Spinner size='sm' /> : 'Ajouter'}
            </Button>
          </InputGroup>
          {addForm.formState.errors.direction && (
            <div className='text-danger small mt-1'>
              <i className='bi bi-exclamation-circle me-1'></i>
              {addForm.formState.errors.direction.message}
            </div>
          )}
        </Form>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant='danger' dismissible onClose={() => {}}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <div className='table-container'>
        <Table responsive hover>
          <thead>
            <tr className='table-header'>
              <th>Nom de la direction</th>
              {role === 'service_formation' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDirections.map(direction => (
              <tr key={direction.idDirection} className='table-row'>
                <td className='table-cell'>
                  {editingId === direction.idDirection && role === 'service_formation' ? (
                    <Form onSubmit={editForm.handleSubmit(handleSave)}>
                      <InputGroup>
                        <Form.Control
                          {...editForm.register('direction')}
                          className={editForm.formState.errors.direction ? 'is-invalid' : ''}
                          disabled={loading}
                        />
                        <Button
                          type='submit'
                          className='action-button success'
                          size='sm'
                          disabled={loading || !editForm.formState.isValid}
                        >
                          Sauvegarder
                        </Button>
                        <Button
                          type='button'
                          className='action-button'
                          size='sm'
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                      </InputGroup>
                      {editForm.formState.errors.direction && (
                        <div className='text-danger small mt-1'>
                          <i className='bi bi-exclamation-circle me-1'></i>
                          {editForm.formState.errors.direction.message}
                        </div>
                      )}
                    </Form>
                  ) : (
                    direction.direction || 'N/A'
                  )}
                </td>
                <td className='table-cell'>
                  {editingId !== direction.idDirection && role === 'service_formation' && (
                    <>
                      <Button
                        className='action-button'
                        size='sm'
                        onClick={() => handleEdit(direction)}
                        disabled={loading}
                      >
                        Modifier
                      </Button>
                      <Button
                        className='action-button danger'
                        size='sm'
                        onClick={() => handleDelete(direction.idDirection)}
                        disabled={loading}
                      >
                        Supprimer
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

// Position Management Component
const PositionManagement = ({ role }) => {
  const { positions, loading, error, createPosition, updatePosition, deletePosition } =
    usePositions();

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form for adding new positions
  const addForm = useForm({
    resolver: zodResolver(positionSchema),
    mode: 'onChange',
    defaultValues: { poste: '' },
  });

  // Form for editing positions
  const editForm = useForm({
    resolver: zodResolver(positionSchema),
    mode: 'onChange',
    defaultValues: { poste: '' },
  });

  const handleAdd = async data => {
    const result = await createPosition(data);
    if (result.success) {
      addForm.reset();
    }
  };

  const handleEdit = position => {
    setEditingId(position.idPoste);
    editForm.reset({ poste: position.poste });
  };

  const handleSave = async data => {
    const result = await updatePosition(editingId, data);
    if (result.success) {
      setEditingId(null);
      editForm.reset();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    editForm.reset();
  };

  const handleDelete = async id => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce poste ?')) return;
    await deletePosition(id);
  };

  const filteredPositions = positions.filter(
    position => position.poste && position.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <InputGroup className='mb-3 position-relative'>
        <Form.Control
          type='text'
          placeholder='Rechercher un poste...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='ps-5'
        />
        <BsSearch
          style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6c757d',
            pointerEvents: 'none',
          }}
        />
      </InputGroup>

      {/* Add Form */}
      {role === 'service_formation' && (
        <Form onSubmit={addForm.handleSubmit(handleAdd)} className='mb-3'>
          <InputGroup>
            <Form.Control
              placeholder='Ajouter un poste '
              {...addForm.register('poste')}
              className={addForm.formState.errors.poste ? 'is-invalid' : ''}
              disabled={loading}
            />
            <Button
              type='submit'
              className='action-button success'
              disabled={loading || !addForm.formState.isValid}
            >
              {loading ? <Spinner size='sm' /> : 'Ajouter'}
            </Button>
          </InputGroup>
          {addForm.formState.errors.poste && (
            <div className='text-danger small mt-1'>
              <i className='bi bi-exclamation-circle me-1'></i>
              {addForm.formState.errors.poste.message}
            </div>
          )}
        </Form>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant='danger' dismissible onClose={() => {}}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <div className='table-container'>
        <Table responsive hover>
          <thead>
            <tr className='table-header'>
              <th>Nom du poste</th>
              {role === 'service_formation' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPositions.map(position => (
              <tr key={position.idPoste} className='table-row'>
                <td className='table-cell'>
                  {editingId === position.idPoste ? (
                    <Form onSubmit={editForm.handleSubmit(handleSave)}>
                      <InputGroup>
                        <Form.Control
                          {...editForm.register('poste')}
                          className={editForm.formState.errors.poste ? 'is-invalid' : ''}
                          disabled={loading}
                        />
                        <Button
                          type='submit'
                          className='action-button success'
                          size='sm'
                          disabled={loading || !editForm.formState.isValid}
                        >
                          Sauvegarder
                        </Button>
                        <Button
                          type='button'
                          className='action-button'
                          size='sm'
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          Annuler
                        </Button>
                      </InputGroup>
                      {editForm.formState.errors.poste && (
                        <div className='text-danger small mt-1'>
                          <i className='bi bi-exclamation-circle me-1'></i>
                          {editForm.formState.errors.poste.message}
                        </div>
                      )}
                    </Form>
                  ) : (
                    position.poste || 'N/A'
                  )}
                </td>
                <td className='table-cell'>
                  {editingId !== position.idPoste && role === 'service_formation' && (
                    <>
                      <Button
                        className='action-button'
                        size='sm'
                        onClick={() => handleEdit(position)}
                        disabled={loading}
                      >
                        Modifier
                      </Button>
                      <Button
                        className='action-button danger'
                        size='sm'
                        onClick={() => handleDelete(position.idPoste)}
                        disabled={loading}
                      >
                        Supprimer
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

// Main Structure Management Component
const StructureManagement = ({ userInfo }) => {
  const allowedRoles = ['service_formation', 'admin', 'directeur_general'];

  if (!userInfo) {
    return <Loader />;
  }
  if (!allowedRoles.includes(userInfo.role)) {
    return (
      <div className='container mt-5'>
        <Error message='Vous avez pas accès à cette page.' showHomeLink={true} />
      </div>
    );
  }
  return (
    <div className='main-content'>
      <div className='container-fluid'>
        <h1
          className='page-title font-semibold'
          style={{
            fontSize: '28px',
            color: '#0a2463', // Bleu nuit intense
            letterSpacing: '0.5px', // Espacement subtil pour l'élégance
          }}
        >
          <FaBuilding className='me-2' style={{ verticalAlign: 'middle' }} />
          Gestion des structures
        </h1>

        <Card className='table-container'>
          <Card.Body>
            <Tabs defaultActiveKey='directions' className='mb-4'>
              <Tab
                eventKey='directions'
                title={
                  <span>
                    <FaBuilding className='me-2 text-primary' />
                    Directions
                  </span>
                }
              >
                <DirectionManagement role={userInfo.role} />
              </Tab>

              <Tab
                eventKey='positions'
                title={
                  <span>
                    <FaUserTie className='me-2 text-primary' />
                    Postes
                  </span>
                }
              >
                <PositionManagement role={userInfo.role} />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StructureManagement;
