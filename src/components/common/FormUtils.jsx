import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

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
  className = 'form-control',
  helpText,
  as = 'input',
  rows,
  ...props
}) => (
  <Form.Group className='mb-3'>
    <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
    <Form.Control
      as={as}
      type={type}
      rows={rows}
      className={error ? `${className} is-invalid` : className}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      {...register(name)}
      {...props}
    />
    {helpText && <Form.Text className='text-muted small'>{helpText}</Form.Text>}
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
  disabled = false,
  className = 'form-control',
  placeholder = 'Sélectionnez une option',
  ...props
}) => (
  <Form.Group className='mb-3'>
    <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
    <Form.Select
      className={error ? `${className} is-invalid` : className}
      disabled={disabled}
      {...register(name)}
      {...props}
    >
      <option value=''>{placeholder}</option>
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
  disabled = false,
}) => (
  <Form.Group className='mb-3'>
    <Form.Label>{label}</Form.Label>
    <Form.Check
      type='switch'
      id={id}
      label={checked ? activeLabel : inactiveLabel}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  </Form.Group>
);

// Specialized Number Field Component for numeric inputs
export const NumberField = ({
  label,
  name,
  placeholder,
  register,
  error,
  required = false,
  disabled = false,
  min,
  max,
  step,
  className = 'form-control',
  ...props
}) => (
  <Form.Group className='mb-3'>
    <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
    <Form.Control
      type='number'
      className={error ? `${className} is-invalid` : className}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
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

// Reusable Phone Field Component
export const PhoneField = ({
  label,
  name,
  placeholder = 'Ex: 0123456789',
  register,
  error,
  required = false,
  disabled = false,
  className = 'form-control',
  ...props
}) => {
  const handleInput = e => {
    // Only allow digits and limit to 10 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = value;
  };

  return (
    <Form.Group className='mb-3'>
      <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
      <Form.Control
        type='tel'
        inputMode='numeric'
        pattern='[0-9]*'
        className={error ? `${className} is-invalid` : className}
        placeholder={placeholder}
        disabled={disabled}
        onInput={handleInput}
        maxLength={10}
        {...register(name)}
        {...props}
      />
      <Form.Text className='text-muted small'>
        Format: 10 chiffres exactement (ex: 0123456789)
      </Form.Text>
      {error && (
        <div className='text-danger small mt-1'>
          <i className='bi bi-exclamation-circle me-1'></i>
          {error.message}
        </div>
      )}
    </Form.Group>
  );
};

// Reusable Date Field Component
export const DateField = ({
  label,
  name,
  register,
  error,
  required = false,
  disabled = false,
  min,
  max,
  className = 'form-control',
  ...props
}) => (
  <Form.Group className='mb-3'>
    <Form.Label className={required ? 'required' : ''}>{label}</Form.Label>
    <Form.Control
      type='date'
      className={error ? `${className} is-invalid` : className}
      disabled={disabled}
      min={min}
      max={max}
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

// Error Alert Component
export const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <Alert variant='danger' dismissible={!!onDismiss} onClose={onDismiss}>
      <i className='bi bi-exclamation-triangle me-2'></i>
      {error}
    </Alert>
  );
};

// Success Alert Component
export const SuccessAlert = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <Alert variant='success' dismissible={!!onDismiss} onClose={onDismiss}>
      <i className='bi bi-check-circle me-2'></i>
      {message}
    </Alert>
  );
};

// Form Action Buttons Component
export const FormActionButtons = ({
  loading,
  onCancel,
  cancelText = 'Annuler',
  submitText = 'Enregistrer',
  loadingText = 'Enregistrement...',
  canSubmit = true,
  submitVariant = 'primary',
  cancelVariant = 'secondary',
}) => (
  <div className='d-flex justify-content-end gap-3'>
    <Button variant={cancelVariant} onClick={onCancel} disabled={loading} className='px-4'>
      {cancelText}
    </Button>
    <Button type='submit' variant={submitVariant} disabled={loading || !canSubmit} className='px-4'>
      {loading ? (
        <>
          <span
            className='spinner-border spinner-border-sm me-2'
            role='status'
            aria-hidden='true'
          ></span>
          {loadingText}
        </>
      ) : (
        submitText
      )}
    </Button>
  </div>
);

// Debug Panel Component (for development)
export const FormDebugPanel = ({ formState, canSubmit }) => {
  if (true) return null;

  return (
    <Alert variant='info' className='small mb-3'>
      <strong>🔧 Debug:</strong> Valid: {formState.isValid ? '✅' : '❌'} | Dirty:{' '}
      {formState.isDirty ? '✅' : '❌'} | Can Submit: {canSubmit ? '✅' : '❌'} | Errors:{' '}
      {Object.keys(formState.errors).length}
      {Object.keys(formState.errors).length > 0 && (
        <div className='mt-1'>
          {Object.entries(formState.errors).map(([key, error]) => (
            <div key={key}>
              • {key}: {error?.message}
            </div>
          ))}
        </div>
      )}
    </Alert>
  );
};

// Standard Modal Props
export const standardModalProps = {
  backdrop: 'static',
  keyboard: false,
  dialogClassName: 'modal-dialog-centered',
};

// Common form utilities
export const formUtils = {
  // Reset form with default values
  resetForm: (form, defaultValues = {}) => {
    form.reset(defaultValues);
  },

  // Get current date in YYYY-MM-DD format
  getCurrentDate: () => {
    return new Date().toISOString().split('T')[0];
  },

  // Get current year
  getCurrentYear: () => {
    return new Date().getFullYear();
  },

  // Format number for display
  formatNumber: (value, decimals = 2) => {
    return Number(value).toFixed(decimals);
  },

  // Clean phone number
  cleanPhoneNumber: phone => {
    return phone.replace(/\D/g, '');
  },
};
