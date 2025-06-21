import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPlanSchema } from '../../utils/formValidation';
import { 
  NumberField, 
  FormField,
  ErrorAlert,
  FormActionButtons,
  FormDebugPanel,
  standardModalProps,
  formUtils
} from '../common/FormUtils';
import '../../styles/forms.css';

const CreatePlanModal = ({ show, onHide, onSave, loading = false }) => {
  const [submitError, setSubmitError] = useState('');
  
  const form = useForm({
    resolver: zodResolver(createPlanSchema),
    mode: 'onChange',
    defaultValues: {
      annee: formUtils.getCurrentYear(),
      notes: '',
    }
  });

  const onSubmit = async (data) => {
    setSubmitError('');
    
    try {
      const result = await onSave(data);
      
      if (result?.success !== false) {
        handleCancel();
      } else {
        setSubmitError(result?.message || "Une erreur est survenue lors de la création du plan");
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      setSubmitError(error?.message || "Une erreur est survenue lors de la création du plan");
    }
  };

  const handleCancel = () => {
    form.reset({
      annee: formUtils.getCurrentYear(),
      notes: '',
    });
    setSubmitError('');
    onHide();
  };

  const canSubmit = form.formState.isValid && !loading;

  return (
    <Modal 
      show={show} 
      onHide={handleCancel} 
      size='md'
      {...standardModalProps}
    >
      <Modal.Header closeButton>
        <Modal.Title className='text-primary fw-bold'>
          <i className="bi bi-calendar-plus me-2"></i>
          Créer un nouveau plan de formation
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          <ErrorAlert error={submitError} onDismiss={() => setSubmitError('')} />
          
          <FormDebugPanel 
            formState={form.formState}
            canSubmit={canSubmit}
          />
          
          <div className='row g-3'>
            <div className='col-12'>
              <NumberField
                label='Année'
                name='annee'
                placeholder={`Ex: ${formUtils.getCurrentYear()}`}
                register={form.register}
                error={form.formState.errors.annee}
                required
                disabled={loading}
                min={formUtils.getCurrentYear()}
                max={formUtils.getCurrentYear() + 10}
                helpText={`L'année doit être comprise entre ${formUtils.getCurrentYear()} et ${formUtils.getCurrentYear() + 10}`}
              />
            </div>

            <div className='col-12'>
              <FormField
                label='Notes (optionnel)'
                name='notes'
                as='textarea'
                rows={4}
                placeholder="Ajoutez des notes ou commentaires sur ce plan de formation..."
                register={form.register}
                error={form.formState.errors.notes}
                disabled={loading}
                helpText="Ces notes apparaîtront dans les détails du plan"
              />
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <FormActionButtons
            loading={loading}
            onCancel={handleCancel}
            canSubmit={canSubmit}
            submitText='Créer le plan'
            loadingText='Création en cours...'
          />
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreatePlanModal;