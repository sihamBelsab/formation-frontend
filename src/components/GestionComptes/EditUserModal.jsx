import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdateSchema } from '../../utils/formValidation';
import {
  columnLabels,
  roleOptions,
  FormField,
  SelectField,
  SwitchField,
  MatriculeField,
  useEmailAutoGeneration,
} from './userFormUtils.jsx';
import { PhoneField } from '../common/FormUtils';
import '../../styles/forms.css';

export const EditUserModal = ({
  showUpdateModal,
  setShowUpdateModal,
  rowToUpdate,
  handleUpdateSave,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const form = useForm({
    resolver: zodResolver(userUpdateSchema),
    mode: 'onChange',
    defaultValues: {},
    criteriaMode: 'all',
  });

  // Auto-generate email when nom or prenom changes
  useEmailAutoGeneration(form);

  // Debug form state
  const formErrors = form.formState.errors;
  const isFormValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;

  // Debug logging (remove in production)
  React.useEffect(() => {
    console.log('Form validation state:', {
      isValid: isFormValid,
      isDirty: isDirty,
      errors: formErrors,
      values: form.getValues(),
    });
  }, [isFormValid, isDirty, formErrors, form]);

  // Reset form when rowToUpdate changes
  React.useEffect(() => {
    if (rowToUpdate) {
      const resetData = {
        nom: rowToUpdate.nom || '',
        prenom: rowToUpdate.prenom || '',
        tel: rowToUpdate.tel || '',
        email: rowToUpdate.email || '',
        matricule: String(rowToUpdate.matricule || ''), // Ensure it's a string
        role: rowToUpdate.role || '',
        status: rowToUpdate.status || 'actif',
        changePassword: false,
        mot_de_pass: '',
      };

      form.reset(resetData);
      setSubmitError('');
    }
  }, [rowToUpdate, form]);

  const handleCancel = () => {
    setSubmitError('');
    setShowUpdateModal(false);
  };

  const onSubmit = async data => {
    setLoading(true);
    setSubmitError('');

    try {
      // Remove password from submission if not changing
      const submitData = { ...data };
      if (!data.changePassword) {
        delete submitData.mot_de_pass;
      }
      delete submitData.changePassword;
      console.log(rowToUpdate);
      console.log(submitData);

      const response = await handleUpdateSave(rowToUpdate.id_utilisateur, submitData);

      if (response?.success !== false) {
        setShowUpdateModal(false);
      } else {
        setSubmitError(response?.message || 'Une erreur est survenue lors de la modification');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSubmitError(error?.message || 'Une erreur est survenue lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const watchChangePassword = form.watch('changePassword');
  const watchedValues = form.watch([
    'nom',
    'prenom',
    'tel',
    'email',
    'matricule',
    'role',
    'mot_de_pass',
  ]);

  // Check if form can be submitted
  const canSubmit = React.useMemo(() => {
    const values = form.getValues();
    const errors = form.formState.errors;

    // Check required fields
    const requiredFields = ['nom', 'prenom', 'tel', 'email', 'matricule', 'role'];
    const hasRequiredFields = requiredFields.every(
      field => values[field] && String(values[field]).trim() !== ''
    );

    // Check password validation if changing password
    const passwordValid =
      !values.changePassword || (values.mot_de_pass && values.mot_de_pass.length >= 6);

    // Check if there are any critical errors
    const hasBlockingErrors = Object.keys(errors).some(
      key => key !== 'changePassword' && errors[key]
    );

    return hasRequiredFields && passwordValid && !hasBlockingErrors;
  }, [form.formState.errors, watchChangePassword, watchedValues]);

  return (
    <Modal
      show={showUpdateModal}
      onHide={handleCancel}
      dialogClassName='custom-modal-dialog'
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className='modal-title'>Modifier un Compte</Modal.Title>
      </Modal.Header>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Modal.Body>
          {submitError && (
            <div className='alert alert-danger' role='alert'>
              <i className='bi bi-exclamation-triangle me-2'></i>
              {submitError}
            </div>
          )}

          {rowToUpdate && (
            <div className='row'>
              <div className='col-md-6'>
                <FormField
                  label={columnLabels.nom}
                  name='nom'
                  placeholder='Veuillez saisir le nom'
                  register={form.register}
                  error={form.formState.errors.nom}
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
                  placeholder='Email auto-généré'
                  register={form.register}
                  error={form.formState.errors.email}
                  readOnly
                />

                <SelectField
                  label={columnLabels.role}
                  name='role'
                  options={roleOptions}
                  register={form.register}
                  error={form.formState.errors.role}
                />
              </div>

              <div className='col-md-6'>
                <FormField
                  label={columnLabels.prenom}
                  name='prenom'
                  placeholder='Veuillez saisir le prénom'
                  register={form.register}
                  error={form.formState.errors.prenom}
                />

                <MatriculeField
                  label={columnLabels.matricule}
                  name='matricule'
                  placeholder='Veuillez saisir le matricule'
                  register={form.register}
                  error={form.formState.errors.matricule}
                />

                <Form.Group className='mb-3'>
                  <Form.Check
                    type='switch'
                    id='change-password-switch'
                    label='Changer le mot de passe'
                    checked={watchChangePassword}
                    {...form.register('changePassword')}
                    onChange={e => {
                      form.setValue('changePassword', e.target.checked);
                      if (!e.target.checked) {
                        form.setValue('mot_de_pass', '');
                      }
                    }}
                  />
                </Form.Group>

                <FormField
                  label={columnLabels.mot_de_pass}
                  name='mot_de_pass'
                  type='password'
                  placeholder='Nouveau mot de passe'
                  register={form.register}
                  error={form.formState.errors.mot_de_pass}
                  disabled={!watchChangePassword}
                />

                <SwitchField
                  label='Statut'
                  id='status-switch-edit'
                  checked={form.watch('status') === 'actif'}
                  onChange={e => {
                    form.setValue('status', e.target.checked ? 'actif' : 'inactif');
                  }}
                />
              </div>
            </div>
          )}
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
                Modification...
              </>
            ) : (
              'Modifier'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
