import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

const SearchForm = ({
  searchTerm = '',
  onSearchChange,
  placeholder = 'Rechercher...',
  className = '',
  disabled = false,
}) => {
  return (
    <InputGroup className={`mb-3 ${className}`}>
      <InputGroup.Text className='bg-white border-end-0'>
        <BsSearch className='text-muted' />
      </InputGroup.Text>
      <Form.Control
        type='text'
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className='border-start-0'
        disabled={disabled}
      />
    </InputGroup>
  );
};

export default SearchForm;
