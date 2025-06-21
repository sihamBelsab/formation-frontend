export const generateCSVContent = (data, emptyRowTemplate) => {
  const csvHeader = Object.keys(emptyRowTemplate).join(',') + '\n';
  const csvRows = data
    .map(row =>
      Object.keys(emptyRowTemplate)
        .map(key => row[key])
        .join(',')
    )
    .join('\n');
  return csvHeader + csvRows;
};

export const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const sortByProperty = (data, property) => {
  return [...data].sort((a, b) => (a[property] || '').localeCompare(b[property] || ''));
};

/**
 * Validate matricule format (6 digits)
 * @param {string} matricule - The matricule to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateMatricule = matricule => {
  return /^\d{6}$/.test(matricule);
};

/**
 * Format date to local string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = date => {
  return new Date(date).toLocaleDateString('fr-FR');
};

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 * @param {Object} columnLabels - Object mapping keys to display labels
 */
export const exportToCSV = (data, filename = 'data.csv', columnLabels = {}) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvHeader = headers.map(key => columnLabels[key] || key).join(',') + '\n';
  const csvRows = data
    .map(row =>
      headers
        .map(key => {
          const value = row[key];
          // Handle values that contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Filter array of objects based on search text
 * @param {Array} data - Array to filter
 * @param {string} searchText - Text to search for
 * @returns {Array} - Filtered array
 */
export const filterData = (data, searchText) => {
  if (!searchText.trim()) return data;

  const searchLower = searchText.toLowerCase();
  return data.filter(item =>
    Object.values(item).some(value => value && value.toString().toLowerCase().includes(searchLower))
  );
};

/**
 * Paginate array data
 * @param {Array} data - Data to paginate
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} - Paginated result with items and pagination info
 */
export const paginateData = (data, currentPage, itemsPerPage) => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = data.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  };
};

/**
 * Show notification function (can be enhanced with toast library)
 * @param {string} message - Message to show
 * @param {string} type - Type of notification (success, error, warning, info)
 */
export const showNotification = (message, type = 'info') => {
  // For now, using console.log. In a real app, you'd use a toast library
  console.log(`[${type.toUpperCase()}] ${message}`);

  // You can integrate with libraries like react-toastify here
  // toast[type](message);
};

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
