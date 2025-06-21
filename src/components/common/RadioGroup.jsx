import React from 'react';
import { Form } from 'react-bootstrap';

const RadioGroup = ({ name, options, value, onChange, inline = true, className = '' }) => (
  <div className={`d-flex gap-3 ms-2 ${className}`}>
    {options.map(option => (
      <Form.Check
        key={option}
        type='radio'
        label={option}
        name={name}
        value={option}
        checked={value === option}
        onChange={onChange}
        inline={inline}
      />
    ))}
  </div>
);

export default RadioGroup;
