import React, { useState, useRef, useEffect } from 'react';
import { Form, Dropdown } from 'react-bootstrap';

const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Rechercher...',
  displayField = 'label',
  valueField = 'value',
  disabled = false,
  isInvalid = false,
  className = '',
  noResultsText = 'Aucun résultat trouvé',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(
        option => option[valueField]?.toString() === value?.toString()
      );
      if (selectedOption) {
        setDisplayValue(getDisplay(selectedOption));
        setSearchTerm(getDisplay(selectedOption));
      }
    } else {
      setDisplayValue('');
      setSearchTerm('');
    }
  }, [value, options, displayField, valueField]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option[displayField]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change
  const handleInputChange = e => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setDisplayValue(inputValue);
    setIsOpen(true);

    // If input is empty, clear selection
    if (!inputValue) {
      onChange('');
    }
  };

  // Handle option selection
  const handleOptionSelect = option => {
    const selectedValue = option[valueField];
    const selectedDisplay = getDisplay(option);

    setDisplayValue(selectedDisplay);
    setSearchTerm(selectedDisplay);
    setIsOpen(false);
    onChange(selectedValue);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur (with delay to allow option selection)
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);

      const exactMatch = options.find(
        option => getDisplay(option)?.toLowerCase() === searchTerm.toLowerCase()
      );

      if (!exactMatch && searchTerm) {
        setDisplayValue('');
        setSearchTerm('');
        onChange('');
      }
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const getDisplay = option => {
    if (typeof displayField === 'function') return displayField(option);
    return option[displayField];
  };

  return (
    <div className='position-relative' ref={dropdownRef}>
      <Form.Control
        ref={inputRef}
        type='text'
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        isInvalid={isInvalid}
        className={className}
        autoComplete='off'
      />

      {isOpen && !disabled && (
        <div className='searchable-select-dropdown'>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option[valueField] || index}
                className='searchable-select-option'
                onMouseDown={e => e.preventDefault()} // Prevent input blur
                onClick={() => handleOptionSelect(option)}
              >
                {getDisplay(option)}
              </div>
            ))
          ) : (
            <div className='searchable-select-no-results'>{noResultsText}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
