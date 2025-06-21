import React, { useState, useEffect } from 'react';
import { Modal, Form, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainingNeedSchema } from '../../utils/formValidation';
import {
  FormField,
  SelectField,
  DateField,
  ErrorAlert,
  FormActionButtons,
  FormDebugPanel,
  standardModalProps,
  formUtils,
} from '../common/FormUtils';
import '../../styles/forms.css';

const priorityOptions = [
  { value: 'Elevée', label: 'Élevée' },
  { value: 'Moyenne', label: 'Moyenne' },
  { value: 'Faible', label: 'Faible' },
];

const TrainingNeedForm = ({
  show,
  onHide,
  onSave,
  trainingNeed = null,
  directions = [],
  employees = [],
  loading = false,
}) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    resolver: zodResolver(trainingNeedSchema),
    mode: 'onChange',
    defaultValues: {
      titre: '',
      objectif: '',
      dateSouhaitee: '',
      priorite: '',
      id_direction: '',
    },
  });

  // Reset form when modal opens/closes or training need changes
  useEffect(() => {
    if (show) {
      if (trainingNeed) {
        form.reset({
          titre: trainingNeed.titre || '',
          objectif: trainingNeed.objectif || '',
          dateSouhaitee: trainingNeed.dateSouhaitee || '',
          priorite: trainingNeed.priorite || '',
          id_direction: trainingNeed.id_direction?.toString() || '',
        });
        setSelectedEmployees(trainingNeed.employees || []);
      } else {
        form.reset({
          titre: '',
          objectif: '',
          dateSouhaitee: '',
          priorite: '',
          id_direction: '',
        });
        setSelectedEmployees([]);
      }
      setSubmitError('');
    }
  }, [show, trainingNeed, form]);

  // Handle employee selection
  const handleEmployeeSelection = employee => {
    setSelectedEmployees(prev => {
      const isSelected = prev.some(emp => emp.id_employe === employee.id_employe);

      if (isSelected) {
        return prev.filter(emp => emp.id_employe !== employee.id_employe);
      } else {
        return [...prev, employee];
      }
    });
  };

  // Handle form submission
  const onSubmit = async data => {
    setSubmitError('');

    try {
      if (selectedEmployees.length === 0) {
        setSubmitError('Veuillez sélectionner au moins un employé concerné');
        return;
      }

      const submitData = {
        ...data,
        employees: selectedEmployees,
      };

      const result = await onSave(submitData);

      if (result?.success !== false) {
        handleCancel();
      } else {
        setSubmitError(result?.message || "Une erreur est survenue l'enregistrement");
      }
    } catch (error) {
      console.error('Error saving training need:', error);
      setSubmitError(error?.message || "Une erreur est survenue l'enregistrement");
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedEmployees([]);
    setSubmitError('');
    onHide();
  };

  // Filter employees by selected direction
  const watchedDirection = form.watch('id_direction');
  const filteredEmployees = watchedDirection
    ? employees.filter(emp => emp.id_direction?.toString() === watchedDirection)
    : [];

  const canSubmit = form.formState.isValid && selectedEmployees.length > 0 && !loading;

  // Direction options
  const directionOptions = directions.map(dir => ({
    value: dir.idDirection,
    label: dir.direction,
  }));

  return (
    <Modal show={show} onHide={handleCancel} size='xl' {...standardModalProps}>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary fw-bold'>
          <i className='bi bi-clipboard-check me-2'></i>
          {trainingNeed ? 'Modifier' : 'Nouveau'} besoin de formation
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          <ErrorAlert error={submitError} onDismiss={() => setSubmitError('')} />

          <FormDebugPanel formState={form.formState} canSubmit={canSubmit} />

          <div className='row g-3'>
            {/* Title and Date */}
            <div className='col-md-6'>
              <FormField
                label='Titre'
                name='titre'
                placeholder='Entrez le titre du besoin'
                register={form.register}
                error={form.formState.errors.titre}
                required
                disabled={loading}
              />

              <DateField
                label='Date souhaitée'
                name='dateSouhaitee'
                register={form.register}
                error={form.formState.errors.dateSouhaitee}
                required
                disabled={loading}
                min={formUtils.getCurrentDate()}
              />
            </div>

            {/* Priority and Direction */}
            <div className='col-md-6'>
              <SelectField
                label='Priorité'
                name='priorite'
                options={priorityOptions}
                register={form.register}
                error={form.formState.errors.priorite}
                required
                disabled={loading}
                placeholder='Sélectionnez la priorité'
              />

              <SelectField
                label='Direction'
                name='id_direction'
                options={directionOptions}
                register={form.register}
                error={form.formState.errors.id_direction}
                required
                disabled={loading}
                placeholder='Sélectionnez la direction'
              />
            </div>

            {/* Objective */}
            <div className='col-12'>
              <FormField
                label='Objectif'
                name='objectif'
                as='textarea'
                rows={4}
                placeholder="Décrivez l'objectif du besoin de formation"
                register={form.register}
                error={form.formState.errors.objectif}
                required
                disabled={loading}
                helpText='Minimum 10 caractères, maximum 1000 caractères'
              />
            </div>
          </div>

          {/* Employee Selection */}
          {watchedDirection && (
            <div className='mt-4'>
              <h6 className='mb-3'>
                <i className='bi bi-people me-2'></i>
                Employés concernés
                <span className='badge bg-primary ms-2'>
                  {selectedEmployees.length} sélectionné(s)
                </span>
              </h6>

              {filteredEmployees.length > 0 ? (
                <div className='table-responsive' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table striped hover size='sm'>
                    <thead className='table-dark sticky-top'>
                      <tr>
                        <th width='50'>
                          <Form.Check
                            type='checkbox'
                            checked={selectedEmployees.length === filteredEmployees.length}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedEmployees(filteredEmployees);
                              } else {
                                setSelectedEmployees([]);
                              }
                            }}
                          />
                        </th>
                        <th>Matricule</th>
                        <th>Nom complet</th>
                        <th>Grade</th>
                        <th>Poste</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(employee => (
                        <tr
                          key={employee.id_employe}
                          className={
                            selectedEmployees.some(emp => emp.id_employe === employee.id_employe)
                              ? 'table-primary'
                              : ''
                          }
                        >
                          <td>
                            <Form.Check
                              type='checkbox'
                              checked={selectedEmployees.some(
                                emp => emp.id_employe === employee.id_employe
                              )}
                              onChange={() => handleEmployeeSelection(employee)}
                            />
                          </td>
                          <td>{employee.matricule}</td>
                          <td>
                            {employee.prenom} {employee.nom}
                          </td>
                          <td>
                            <span className='badge bg-secondary'>{employee.grade}</span>
                          </td>
                          <td>{employee.poste}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className='alert alert-info'>
                  <i className='bi bi-info-circle me-2'></i>
                  Aucun employé trouvé dans cette direction.
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <FormActionButtons
            loading={loading}
            onCancel={handleCancel}
            canSubmit={canSubmit}
            submitText={trainingNeed ? 'Modifier' : 'Créer'}
            loadingText={trainingNeed ? 'Modification...' : 'Création...'}
          />
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TrainingNeedForm;
