import React from 'react';
import { Form } from 'react-bootstrap';

// Function to clean name for email generation
export const cleanNameForEmail = name => {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .trim();
};

// Function to generate email
export const generateEmail = (nom, prenom) => {
  const cleanNom = cleanNameForEmail(nom);
  const cleanPrenom = cleanNameForEmail(prenom);

  if (cleanNom && cleanPrenom) {
    return `${cleanPrenom}.${cleanNom}@cevital.com`;
  }
  return '';
};

// Column labels for consistency
export const columnLabels = {
  nom: 'Nom',
  prenom: 'Prénom',
  tel: 'Téléphone',
  email: 'Email',
  matricule: 'Matricule',
  mot_de_pass: 'Mot de passe',
  role: 'Rôle',
  status: 'Statut',
};

// Role options
export const roleOptions = [
  { value: '', label: 'Sélectionnez un rôle' },
  { value: 'admin', label: 'Admin' },
  { value: 'directeur_general', label: 'Directeur Général' },
  { value: 'employe', label: 'Employé' },
  { value: 'service_formation', label: 'Service de formation' },
  { value: 'directeur_rh', label: 'Directeur RH' },
  { value: 'responsable_direction', label: 'Responsable direction' },
];

// Reusable Form Field Component
export const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  readOnly = false,
  disabled = false,
  className = 'custom-input',
  ...props
}) => (
  <Form.Group className='mb-3'>
    <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
    <Form.Control
      type={type}
      className={error ? `${className} is-invalid` : className}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      {...register(name)}
      {...props}
    />
    {error && (
      <div className='text-danger small mt-1'>
        <i className='bi bi-exclamation-circle me-1'></i>
        {error.message}
      </div>
    )}
  </Form.Group>
);

// Reusable Select Field Component
export const SelectField = ({
  label,
  name,
  options,
  register,
  error,
  required = false,
  className = 'custom-input',
  ...props
}) => (
  <Form.Group className='mb-3'>
    <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
    <Form.Select
      className={error ? `${className} is-invalid` : className}
      {...register(name)}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
    {error && (
      <div className='text-danger small mt-1'>
        <i className='bi bi-exclamation-circle me-1'></i>
        {error.message}
      </div>
    )}
  </Form.Group>
);

// Reusable Switch Field Component
export const SwitchField = ({
  label,
  id,
  checked,
  onChange,
  activeLabel = 'Actif',
  inactiveLabel = 'Inactif',
}) => (
  <Form.Group className='mb-3'>
    <Form.Label>{label}</Form.Label>
    <Form.Check
      type='switch'
      id={id}
      label={checked ? activeLabel : inactiveLabel}
      checked={checked}
      onChange={onChange}
    />
  </Form.Group>
);

// Specialized Number Field Component for Matricule
export const MatriculeField = ({ 
  label, 
  name, 
  placeholder, 
  register, 
  error, 
  required = false,
  className = 'custom-input',
  value,
  defaultValue,
  ...props
}) => {
  const handleInput = (e) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    e.target.value = value;
  };

  return (
    <Form.Group className='mb-3'>
      <Form.Label className={required ? 'required' : ''}>
        {label}
      </Form.Label>
      <Form.Control
        type='text'
        inputMode='numeric'
        pattern='[0-9]*'
        className={error ? `${className} is-invalid` : className}
        placeholder={placeholder}
        onInput={handleInput}
        maxLength={6}
        {...register(name)}
        {...props}
      />

      {error && (
        <div className="text-danger small mt-1">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error.message}
        </div>
      )}
    </Form.Group>
  );
};

// Hook for email auto-generation
export const useEmailAutoGeneration = form => {
  const watchedNom = form.watch('nom');
  const watchedPrenom = form.watch('prenom');

  React.useEffect(() => {
    const email = generateEmail(watchedNom, watchedPrenom);
    if (email && email !== form.getValues('email')) {
      form.setValue('email', email, { shouldValidate: true });
    }
  }, [watchedNom, watchedPrenom, form]);
};
