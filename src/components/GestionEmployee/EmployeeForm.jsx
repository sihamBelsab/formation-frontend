import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Alert } from 'react-bootstrap';
import { FaUsers, FaIdCard } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../../utils/formValidation';
import {
  SelectField,
  ErrorAlert,
  FormActionButtons,
  FormDebugPanel,
  standardModalProps,
} from '../common/FormUtils';
import SearchableSelect from '../common/SearchableSelect';
import '../../styles/forms.css';

const GRADES = [
  { value: 'Execution', label: 'Exécution' },
  { value: 'Maitrise', label: 'Maîtrise' },
  { value: 'Cadre', label: 'Cadre' },
];

const EmployeeForm = ({
  show,
  onHide,
  employee = null,
  onSave,
  loading,
  employees = [],
  users,
  directions,
  positions,
  directionsLoading,
  positionsLoading,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
    defaultValues: {
      matricule: '',
      grade: '',
      id_direction: '',
      id_poste: '',
    },
  });

  useEffect(() => {
    if (show && !directionsLoading && !positionsLoading) {
      if (employee) {
        const employeeData = {
          matricule: employee.matricule || '',
          grade: employee.grade || '',
          id_direction: employee.id_direction || '',
          id_poste: employee.id_poste || '',
        };
        form.reset(employeeData);
        const user = users.find(u => u.matricule === employee.matricule);
        setUserInfo(user || null);
      } else {
        form.reset({
          matricule: '',
          grade: '',
          id_direction: '',
          id_poste: '',
        });
        setUserInfo(null);
      }
      setSubmitError('');
    }
  }, [employee, show, users, directionsLoading, positionsLoading, form]);

  const handleCancel = () => {
    form.reset();
    setUserInfo(null);
    setSubmitError('');
    onHide();
  };

  const handleMatriculeChange = value => {
    console.log(value);
    form.setValue('matricule', value);
    // form.trigger();
    console.log(form.getValues());

    const user = users.find(u => u.matricule === value);
    setUserInfo(user || null);
  };

  const onSubmit = async data => {
    setSubmitError('');

    try {
      if (!userInfo) {
        setSubmitError('Veuillez sélectionner un matricule valide');
        return;
      }

      const result = await onSave(data);

      if (result?.success !== false) {
        handleCancel();
      } else {
        setSubmitError(result?.message || "Une erreur est survenue lors de l'enregistrement");
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      setSubmitError(error?.message || "Une erreur est survenue lors de l'enregistrement");
    }
  };

  const canSubmit = form.formState.isValid && userInfo && !loading;

  // Direction options
  const directionOptions =
    directions?.map(dir => ({
      value: dir.idDirection,
      label: dir.direction,
    })) || [];

  const positionOptions = positions.map(pos => ({
    value: pos.idPoste,
    label: pos.poste,
  }));
  console.log(positions);
  console.log(directions);

  // Available users (not already assigned to employees except current one)
  const availableUsers =
    users
      ?.filter(user => {
        if (!employees) return true;

        const isCurrentEmployee = employee && user.matricule === employee.matricule;
        const isAlreadyEmployee = employees.some(
          emp => emp.matricule === user.matricule && emp.matricule !== employee?.matricule
        );

        return isCurrentEmployee || !isAlreadyEmployee;
      })
      .map(user => ({
        value: user.matricule,
        label: `${user.matricule} - ${user.nom} ${user.prenom}`,
        isInvalid: false,
      })) || [];

  if (directionsLoading || positionsLoading) {
    return (
      <Modal show={show} onHide={handleCancel} {...standardModalProps}>
        <Modal.Body className='text-center py-4'>
          <div className='spinner-border text-primary mb-3' role='status'>
            <span className='visually-hidden'>Chargement...</span>
          </div>
          <p>Chargement des données...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleCancel} size='lg' {...standardModalProps}>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary fw-bold'>
          <FaUsers className='me-2' />
          {employee ? 'Modifier' : 'Ajouter'} un employé
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          <ErrorAlert error={submitError} onDismiss={() => setSubmitError('')} />

          <FormDebugPanel formState={form.formState} canSubmit={canSubmit} />

          <Row className='g-3'>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label className='required'>
                  <FaIdCard className='me-1' />
                  Matricule
                </Form.Label>
                <SearchableSelect
                  value={form.watch('matricule')}
                  register={form.register}
                  className={
                    form.formState.errors.matricule ? 'form-control is-invalid' : 'form-control'
                  }
                  onChange={handleMatriculeChange}
                  options={availableUsers}
                  placeholder='-- Sélectionnez un matricule --'
                  disabled={loading}
                />
                {form.formState.errors.matricule && (
                  <div className='text-danger small mt-1'>
                    <i className='bi bi-exclamation-circle me-1'></i>
                    {form.formState.errors.matricule.message}
                  </div>
                )}
              </Form.Group>

              <SelectField
                label='Direction'
                name='id_direction'
                options={directionOptions}
                register={form.register}
                error={form.formState.errors.id_direction}
                required
                disabled={loading}
                placeholder='Sélectionnez une direction'
              />
            </Col>

            <Col md={6}>
              <SelectField
                label='Grade'
                name='grade'
                options={GRADES}
                register={form.register}
                error={form.formState.errors.grade}
                required
                disabled={loading}
                placeholder='Sélectionnez un grade'
              />

              <SelectField
                label='Poste'
                name='id_poste'
                options={positionOptions}
                register={form.register}
                error={form.formState.errors.id_poste}
                required
                disabled={loading}
              />
            </Col>
          </Row>

          {/* User Information Display */}

          {/* Warning when no matricule selected */}
          {!userInfo && form.watch('matricule') && (
            <Alert variant='warning' className='mt-3'>
              <i className='bi bi-exclamation-triangle me-2'></i>
              Aucun utilisateur trouvé pour ce matricule.
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <FormActionButtons
            loading={loading}
            onCancel={handleCancel}
            canSubmit={canSubmit}
            submitText={employee ? 'Modifier' : 'Ajouter'}
            loadingText={employee ? 'Modification...' : 'Ajout...'}
          />
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
