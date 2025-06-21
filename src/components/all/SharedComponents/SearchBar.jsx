import React from 'react';
import { Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ filterText, setFilterText }) => {
  return (
    <div className='d-flex align-items-center position-relative' style={{ maxWidth: '300px' }}>
      <FaSearch className='position-absolute' style={{ left: '10px', color: '#aaa' }} />
      <Form.Control
        type='text'
        placeholder='Rechercher...'
        className='ps-4'
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
    </div>
  );
};
