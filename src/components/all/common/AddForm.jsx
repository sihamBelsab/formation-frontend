import React from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';

const AddForm = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Ajouter...',
  buttonText = 'Ajouter',
  loading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <Form onSubmit={onSubmit} className={`mb-3 ${className}`}>
      <InputGroup>
        <Form.Control
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={loading || disabled}
          required
        />
        <Button type='submit' className='action-button success' disabled={loading || disabled}>
          {loading ? <Spinner size='sm' /> : buttonText}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default AddForm;
