import React, { useState, useMemo } from 'react';
import { Table as BootstrapTable, Button, Form, Spinner, Pagination } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown, FaDownload, FaSearch } from 'react-icons/fa';
import './table.css';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  title = '',
  actions = [],
  responsive = true,
  hover = true,
  striped = true,
  className = '',
  selectable = false,
  selectedItems = [],
  onSelectionChange = null,
  searchable = true,
  searchPlaceholder = 'Rechercher...',
  emptyMessage = 'Aucune donnée disponible',
  loadingMessage = 'Chargement en cours...',
  pageSize: defaultPageSize = 10,
  showPagination = true,
  exportable = true,
  exportFilename = 'export',
  onRowClick = null,
  rowClassName = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Generate unique key for each item
  const getItemKey = (item, index) => {
    return (
      item.id ||
      item.idbes ||
      item.id_employe ||
      item.id_direction ||
      item.id_poste ||
      item.idformateur ||
      item.matricule ||
      item.id_utilisateur ||
      `item-${index}`
    );
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(item => {
      const searchText = searchTerm.toLowerCase();
      return columns.some(column => {
        let value;
        if (column.render) {
          try {
            const rendered = column.render(item[column.key], item);
            if (typeof rendered === 'string') {
              value = rendered;
            } else if (React.isValidElement(rendered)) {
              // For React elements, try to extract text content
              value = String(item[column.key] || '');
            } else {
              value = String(rendered || '');
            }
          } catch (error) {
            value = String(item[column.key] || '');
          }
        } else {
          value = String(item[column.key] || '');
        }
        return value.toLowerCase().includes(searchText);
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bVal == null) return sortConfig.direction === 'asc' ? 1 : -1;

      // Convert to string for comparison
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      // Try numeric sorting first
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String sorting
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination || pageSize <= 0) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle sorting
  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle selection
  const isSelected = index => {
    if (!selectedItems) return false;
    const globalIndex = showPagination ? (currentPage - 1) * pageSize + index : index;
    return selectedItems.includes(globalIndex);
  };

  const handleSelectItem = index => {
    if (!onSelectionChange) return;

    const globalIndex = showPagination ? (currentPage - 1) * pageSize + index : index;

    const newSelection = selectedItems.includes(globalIndex)
      ? selectedItems.filter(i => i !== globalIndex)
      : [...selectedItems, globalIndex];

    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedItems.length === sortedData.length) {
      onSelectionChange([]);
    } else {
      const allIndices = [...Array(sortedData.length).keys()];
      onSelectionChange(allIndices);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = columns.map(col => col.label || col.key).join(',');
    const rows = sortedData
      .map(item =>
        columns
          .map(col => {
            let value;
            if (col.render) {
              try {
                const rendered = col.render(item[col.key], item);
                if (typeof rendered === 'string') {
                  value = rendered;
                } else if (React.isValidElement(rendered)) {
                  value = item[col.key] || '';
                } else {
                  value = String(rendered || '');
                }
              } catch (error) {
                value = item[col.key] || '';
              }
            } else {
              value = item[col.key] || '';
            }
            // Escape commas and quotes
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\n');

    const csvContent = headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${exportFilename}.csv`;
    link.click();
  };

  // Render cell content
  const renderCell = (item, column) => {
    if (column.render) {
      try {
        const result = column.render(item[column.key], item);
        if (result && typeof result === 'object' && !React.isValidElement(result)) {
          console.warn('Column render function returned an object, converting to string:', result);
          return JSON.stringify(result);
        }
        return result;
      } catch (error) {
        console.error('Error in column render function:', error);
        return 'Erreur de rendu';
      }
    }

    const value = item[column.key];
    if (value && typeof value === 'object') {
      console.warn('Attempting to render object directly, converting to string:', value);
      return JSON.stringify(value);
    }

    return value || '';
  };

  // Render sort icon
  const renderSortIcon = column => {
    if (!column.sortable) return null;

    if (sortConfig.key === column.key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort className='text-muted' />;
  };

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div className='text-center p-4'>
        <Spinner animation='border' />
        <p className='mt-2'>{loadingMessage}</p>
      </div>
    );
  }

  const showSelection = selectable;

  return (
    <div className={`table-container ${className}`}>
      {/* Title */}
      {title && (
        <div className='mb-3'>
          <h4 className='mb-0'>{title}</h4>
        </div>
      )}

      {/* Header with action buttons on left, search and export on right */}
      <div className='d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3'>
        {/* Action buttons - Left side */}
        <div className='d-flex align-items-center gap-2 flex-wrap'>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              disabled={action.disabled || loading}
              className={action.className || ''}
            >
              {action.icon} {action.label}
            </Button>
          ))}
        </div>

        {/* Search and Export - Right side */}
        <div className='d-flex align-items-center gap-2 flex-wrap'>
          {/* Export button */}
          {exportable && (
            <Button
              variant='outline-success'
              onClick={handleExport}
              disabled={loading || sortedData.length === 0}
            >
              <FaDownload className='me-1' />
              Exporter CSV
            </Button>
          )}

          {/* Search */}
          {searchable && (
            <div className='position-relative' style={{ minWidth: '250px' }}>
              <FaSearch
                className='position-absolute'
                style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}
              />
              <Form.Control
                type='text'
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='ps-4'
                disabled={loading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <small className='text-muted'>
          {sortedData.length} élément(s) trouvé(s)
          {searchTerm && ` (filtré de ${data.length} total)`}
          {selectedItems && selectedItems.length > 0 && ` • ${selectedItems.length} sélectionné(s)`}
        </small>

        {showPagination && totalPages > 1 && (
          <small className='text-muted'>
            Page {currentPage} sur {totalPages}
          </small>
        )}
      </div>

      {/* Table */}
      <BootstrapTable responsive={responsive} hover={hover} striped={striped}>
        <thead>
          <tr className='table-primary'>
            {showSelection && (
              <th style={{ width: '50px' }}>
                <Form.Check
                  type='checkbox'
                  checked={
                    selectedItems &&
                    selectedItems.length === sortedData.length &&
                    sortedData.length > 0
                  }
                  onChange={handleSelectAll}
                  disabled={loading}
                />
              </th>
            )}
            {columns.map((column, colIndex) => (
              <th
                key={column.key || colIndex}
                style={{
                  cursor: column.sortable ? 'pointer' : 'default',
                  width: column.width,
                }}
                onClick={() => column.sortable && handleSort(column.key)}
                className={column.className}
              >
                <div className='d-flex align-items-center justify-content-between'>
                  <span>{column.label}</span>
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => {
              const globalIndex = showPagination ? (currentPage - 1) * pageSize + index : index;
              const rowClass = rowClassName ? rowClassName(item, globalIndex) : '';
              return (
                <tr
                  key={getItemKey(item, globalIndex)}
                  className={`${isSelected(index) ? 'table-warning' : ''} ${rowClass}`}
                  onClick={() => onRowClick && onRowClick(item, globalIndex)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {showSelection && (
                    <td>
                      <Form.Check
                        type='checkbox'
                        checked={isSelected(index)}
                        onChange={() => handleSelectItem(index)}
                        disabled={loading}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${getItemKey(item, globalIndex)}-${column.key || colIndex}`}
                      className={column.cellClassName}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showSelection ? 1 : 0)}
                className='text-center py-4 text-muted'
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </BootstrapTable>

      {/* Pagination at bottom */}
      {showPagination && (
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <div className='text-muted d-flex justify-content-between align-items-center'>
            Affichage de {(currentPage - 1) * pageSize + 1} à{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} sur {sortedData.length} éléments
            <Form.Select
              className='ms-2'
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              <option value='5'>5 par page</option>
              <option value='10'>10 par page</option>
              <option value='25'>25 par page</option>
              <option value='50'>50 par page</option>
              <option value='100'>100 par page</option>
            </Form.Select>
          </div>

          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />

            {/* Show page numbers */}
            {(() => {
              const delta = 2;
              const range = [];
              const rangeWithDots = [];

              for (
                let i = Math.max(2, currentPage - delta);
                i <= Math.min(totalPages - 1, currentPage + delta);
                i++
              ) {
                range.push(i);
              }

              if (currentPage - delta > 2) {
                rangeWithDots.push(1, '...');
              } else {
                rangeWithDots.push(1);
              }

              rangeWithDots.push(...range);

              if (currentPage + delta < totalPages - 1) {
                rangeWithDots.push('...', totalPages);
              } else if (totalPages > 1) {
                rangeWithDots.push(totalPages);
              }

              return rangeWithDots.map((page, index) => {
                if (page === '...') {
                  return <Pagination.Ellipsis key={index} disabled />;
                }
                return (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              });
            })()}

            <Pagination.Next
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Table;
