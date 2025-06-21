import React, { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSchema } from '../../../utils/formValidation';
import '../../../styles/forms.css';

const LocationForm = ({ show, onHide, onSave, location = null, loading = false }) => {
  const form = useForm({
    resolver: zodResolver(locationSchema),
    mode: 'onChange',
    defaultValues: {
      libelle: '',
      numtel: '',
      adresse: '',
      budget: '',
    }
  });

  // Reset form when modal opens/closes or location changes
  useEffect(() => {
    if (show) {
      if (location) {
        form.reset({
          libelle: location.libelle || '',
          numtel: location.numtel || '',
          adresse: location.adresse || '',
          budget: location.budget?.toString() || '',
        });
      } else {
        form.reset({
          libelle: '',
          numtel: '',
          adresse: '',
          budget: '',
        });
      }
    }
  }, [show, location, form]);

  // Handle form submission
  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      budget: parseFloat(data.budget)
    };
    await onSave(submitData, location?.id);
  };

  const handleCancel = () => {
    form.reset();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title className='text-primary fw-bold'>
          {location ? 'Modifier' : 'Ajouter'} un lieu de formation
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className='row g-3'>
            {/* Libelle and Phone */}
            <div className='col-md-6'>
              <Form.Group className='mb-3'>
                <Form.Label className='required'>Libellé</Form.Label>
                <Form.Control
                  type='text'
                  {...form.register('libelle')}
                  className={form.formState.errors.libelle ? 'is-invalid' : ''}
                  placeholder='Nom du lieu de formation'
                />
                {form.formState.errors.libelle && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {form.formState.errors.libelle.message}
                  </div>
                )}
              </Form.Group>
            </div>

            <div className='col-md-6'>
              <Form.Group className='mb-3'>
                <Form.Label className='required'>Téléphone</Form.Label>
                <Form.Control
                  type='tel'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  {...form.register('numtel')}
                  className={form.formState.errors.numtel ? 'is-invalid' : ''}
                  placeholder='Ex: 0123456789'
                  maxLength={10}
                  onInput={(e) => {
                    // Only allow digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    e.target.value = value;
                  }}
                />
                <Form.Text className="text-muted small">
                  Format: 10 chiffres exactement (ex: 0123456789)
                </Form.Text>
                {form.formState.errors.numtel && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {form.formState.errors.numtel.message}
                  </div>
                )}
              </Form.Group>
            </div>

            {/* Address and Budget */}
            <div className='col-md-6'>
              <Form.Group className='mb-3'>
                <Form.Label className='required'>Adresse</Form.Label>
                <Form.Control
                  type='text'
                  {...form.register('adresse')}
                  className={form.formState.errors.adresse ? 'is-invalid' : ''}
                  placeholder='Adresse complète'
                />
                {form.formState.errors.adresse && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {form.formState.errors.adresse.message}
                  </div>
                )}
              </Form.Group>
            </div>

            <div className='col-md-6'>
              <Form.Group className='mb-3'>
                <Form.Label className='required'>Budget</Form.Label>
                <Form.Control
                  type='number'
                  {...form.register('budget')}
                  className={form.formState.errors.budget ? 'is-invalid' : ''}
                  placeholder='Budget alloué'
                  min='0'
                  step='0.01'
                />
                {form.formState.errors.budget && (
                  <div className="text-danger small mt-1">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {form.formState.errors.budget.message}
                  </div>
                )}
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel} disabled={loading}>
            Annuler
          </Button>
          <Button 
            type="submit"
            variant='primary' 
            disabled={!form.formState.isValid || loading}
          >
            {loading ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' />
                Enregistrement...
              </>
            ) : location ? (
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

export default LocationForm;
