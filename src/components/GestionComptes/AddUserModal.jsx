import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../../utils/formValidation';
import { 
  columnLabels, 
  roleOptions, 
  FormField, 
  SelectField, 
  SwitchField,
  MatriculeField,
  useEmailAutoGeneration 
} from './userFormUtils.jsx';
import { PhoneField } from '../common/FormUtils';
import '../../styles/forms.css';

export const AddUserModal = ({
  showForm,
  setShowForm,
  handleAddRow,
  emptyRowTemplate,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');
  
  const form = useForm({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      ...emptyRowTemplate,
      status: 'actif' // Default status
    }
  });

  // Auto-generate email when nom or prenom changes
  useEmailAutoGeneration(form);

  const handleCancel = () => {
    form.reset({
      ...emptyRowTemplate,
      status: 'actif'
    });
    setSubmitError('');
    setShowForm(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitError('');
    
    try {
      const response = await handleAddRow(data);
      
      if (response?.success) {
        setShowForm(false);
        form.reset({
          ...emptyRowTemplate,
          status: 'actif'
        });
      } else {
        setSubmitError(response?.message || 'Une erreur est survenue lors de l\'ajout');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setSubmitError(error?.message || 'Une erreur est survenue lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={showForm} 
      onHide={handleCancel} 
      dialogClassName='custom-modal-dialog'
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className='modal-title'>Ajouter un Compte</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          {submitError && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {submitError}
            </div>
          )}
          
          <div className='row'>
            <div className='col-md-6'>
              <FormField
                label={columnLabels.nom}
                name='nom'
                placeholder='Veuillez saisir le nom'
                register={form.register}
                error={form.formState.errors.nom}
                required
              />

              <PhoneField
                label={columnLabels.tel}
                name='tel'
                placeholder='Ex: 0123456789'
                register={form.register}
                error={form.formState.errors.tel}
                required
                disabled={loading}
              />

              <FormField
                label={columnLabels.email}
                name='email'
                type='email'
                placeholder="Email auto-généré"
                register={form.register}
                error={form.formState.errors.email}
                required
                readOnly
              />

              <SelectField
                label={columnLabels.role}
                name='role'
                options={roleOptions}
                register={form.register}
                error={form.formState.errors.role}
                required
              />
            </div>

            <div className='col-md-6'>
              <FormField
                label={columnLabels.prenom}
                name='prenom'
                placeholder='Veuillez saisir le prénom'
                register={form.register}
                error={form.formState.errors.prenom}
                required
              />

              <MatriculeField
                label={columnLabels.matricule}
                name='matricule'
                placeholder='Veuillez saisir le matricule'
                register={form.register}
                error={form.formState.errors.matricule}
                required
              />

              <FormField
                label={columnLabels.mot_de_pass}
                name='mot_de_pass'
                type='password'
                placeholder='Mot de passe'
                register={form.register}
                error={form.formState.errors.mot_de_pass}
                required
              />

              <SwitchField
                label="Statut"
                id='status-switch-add'
                checked={form.watch('status') === 'actif'}
                onChange={e => {
                  form.setValue('status', e.target.checked ? 'actif' : 'inactif');
                }}
              />
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer className='d-flex justify-content-end gap-3'>
          <Button 
            variant="secondary" 
            onClick={handleCancel}
            disabled={loading}
            className="px-4"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !form.formState.isValid}
            className="px-4"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Ajout...
              </>
            ) : (
              'Ajouter'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
