import React, { useState, useMemo } from 'react';
import { Table, Button, Form, Spinner, Pagination } from 'react-bootstrap';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  editingId = null,
  editingData = {},
  onEditChange = null,
  onSave = null,
  onCancel = null,
  actions = true,
  responsive = true,
  hover = true,
  className = '',
  selectedItems = [],
  onSelectionChange = null,
  selectable = false,
  searchTerm = '',
  filterFunction = null,
  emptyMessage = 'Aucune donnée disponible',
  loadingMessage = 'Chargement en cours...',
  pageSize = 10,
  showPagination = true,
  striped = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Generate unique key for each item
  const getItemKey = (item, index) => {
    return (
      item.id ||
      item.idbes ||
      item.id_employe ||
      item.id_direction ||
      item.id_poste ||
      item.idformateur ||
      `item-${index}`
    );
  };

  // Generate unique key for each column
  const getColumnKey = (column, index) => {
    return column.key || column.field || `col-${index}`;
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || !filterFunction) return data;
    return data.filter(item => filterFunction(item, searchTerm));
  }, [data, searchTerm, filterFunction]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle selection
  const isSelected = index => selectedItems.includes(index);

  const handleSelectItem = index => {
    if (!onSelectionChange) return;

    const newSelection = isSelected(index)
      ? selectedItems.filter(i => i !== index)
      : [...selectedItems, index];

    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedItems.length === sortedData.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...Array(sortedData.length).keys()]);
    }
  };

  // Render cell content
  const renderCell = (item, column) => {
    if (column.render) {
      try {
        const result = column.render(item);
        // Ensure we don't render objects directly
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
    // Safety check to prevent rendering objects
    if (value && typeof value === 'object') {
      console.warn('Attempting to render object directly, converting to string:', value);
      return JSON.stringify(value);
    }

    return value || '';
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

  const showSelection = selectable ;

  return (
    <div className={`table-container ${className}`}>
      <Table responsive={responsive} hover={hover} striped={striped}>
        <thead>
          <tr className='table-primary'>
            {showSelection && (
              <th style={{ width: '50px' }}>
                <Form.Check
                  type='checkbox'
                  checked={selectedItems.length === sortedData.length && sortedData.length > 0}
                  onChange={handleSelectAll}
                  disabled={loading}
                />
              </th>
            )}
            {columns.map((column, colIndex) => (
              <th
                key={getColumnKey(column, colIndex)}
                style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.label}
                {column.sortable && sortConfig.key === column.key && (
                  <span className='ms-1'>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => {
              const globalIndex = showPagination ? (currentPage - 1) * pageSize + index : index;
              return (
                <tr
                  key={getItemKey(item, globalIndex)}
                  className={isSelected(globalIndex) ? 'table-warning' : ''}
                >
                  {showSelection && (
                    <td>
                      <Form.Check
                        type='checkbox'
                        checked={isSelected(globalIndex)}
                        onChange={() => handleSelectItem(globalIndex)}
                        disabled={loading}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td key={`${getItemKey(item, globalIndex)}-${getColumnKey(column, colIndex)}`}>
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
      </Table>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <div className='text-muted'>
            Affichage de {(currentPage - 1) * pageSize + 1} à{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} sur {sortedData.length} éléments
          </div>
          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;

              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

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

export default DataTable;
