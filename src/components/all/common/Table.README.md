# Table Component

A comprehensive, reusable table component for React applications that includes pagination, sorting, search, CSV export, and selection functionality.

## Features

- 📊 **Sortable columns** - Click column headers to sort
- 🔍 **Built-in search** - Filter data across all columns
- 📄 **Pagination** - Configurable page size with navigation
- ✅ **Row selection** - Single or multiple row selection
- 📥 **CSV export** - Export filtered data to CSV
- 🎨 **Custom cell rendering** - Render custom content in cells
- 🎯 **Action buttons** - Configurable action buttons
- ⚡ **Loading states** - Built-in loading and empty states
- 📱 **Responsive** - Mobile-friendly design

## Basic Usage

```jsx
import { Table } from '../components/common';

const MyComponent = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
  ];

  return <Table data={data} columns={columns} title='Users' />;
};
```

## Advanced Usage

```jsx
import { Table } from '../components/common';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdvancedExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, item) => <strong className='text-primary'>{value}</strong>,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: value => <a href={`mailto:${value}`}>{value}</a>,
    },
    {
      key: 'status',
      label: 'Status',
      render: value => (
        <span className={`badge ${value === 'active' ? 'bg-success' : 'bg-secondary'}`}>
          {value}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Add User',
      icon: <FaPlus className='me-1' />,
      onClick: () => handleAdd(),
      variant: 'success',
    },
    {
      label: 'Edit',
      icon: <FaEdit className='me-1' />,
      onClick: () => handleEdit(),
      disabled: selectedItems.length !== 1,
      variant: 'primary',
    },
    {
      label: 'Delete',
      icon: <FaTrash className='me-1' />,
      onClick: () => handleDelete(),
      disabled: selectedItems.length === 0,
      variant: 'danger',
    },
  ];

  return (
    <Table
      title='User Management'
      data={data}
      columns={columns}
      loading={loading}
      actions={actions}
      selectable={true}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      searchable={true}
      searchPlaceholder='Search users...'
      exportable={true}
      exportFilename='users_export'
      pageSize={10}
      onRowClick={item => console.log('Row clicked:', item)}
    />
  );
};
```

## Props API

| Prop                | Type     | Default                      | Description                              |
| ------------------- | -------- | ---------------------------- | ---------------------------------------- |
| `data`              | Array    | `[]`                         | Array of objects to display              |
| `columns`           | Array    | `[]`                         | Column configuration (see Column Config) |
| `loading`           | Boolean  | `false`                      | Show loading state                       |
| `title`             | String   | `''`                         | Table title                              |
| `actions`           | Array    | `[]`                         | Action buttons (see Action Config)       |
| `responsive`        | Boolean  | `true`                       | Enable responsive design                 |
| `hover`             | Boolean  | `true`                       | Enable row hover effect                  |
| `striped`           | Boolean  | `true`                       | Enable striped rows                      |
| `className`         | String   | `''`                         | Additional CSS classes                   |
| `selectable`        | Boolean  | `false`                      | Enable row selection                     |
| `selectedItems`     | Array    | `[]`                         | Array of selected row indices            |
| `onSelectionChange` | Function | `null`                       | Callback when selection changes          |
| `searchable`        | Boolean  | `true`                       | Enable search functionality              |
| `searchPlaceholder` | String   | `'Rechercher...'`            | Search input placeholder                 |
| `emptyMessage`      | String   | `'Aucune donnée disponible'` | Message when no data                     |
| `loadingMessage`    | String   | `'Chargement en cours...'`   | Loading message                          |
| `pageSize`          | Number   | `10`                         | Number of rows per page                  |
| `showPagination`    | Boolean  | `true`                       | Show pagination controls                 |
| `exportable`        | Boolean  | `true`                       | Enable CSV export                        |
| `exportFilename`    | String   | `'export'`                   | CSV filename                             |
| `onRowClick`        | Function | `null`                       | Callback when row is clicked             |
| `rowClassName`      | Function | `null`                       | Function to generate row CSS class       |

## Column Configuration

Each column object can have the following properties:

```jsx
{
  key: 'fieldName',        // Required: Data field name
  label: 'Display Name',   // Required: Column header text
  sortable: true,          // Optional: Enable sorting
  width: '100px',          // Optional: Column width
  className: 'text-center', // Optional: Header CSS class
  cellClassName: 'fw-bold', // Optional: Cell CSS class
  render: (value, item) => { // Optional: Custom cell renderer
    return <CustomComponent value={value} item={item} />;
  }
}
```

## Action Configuration

Each action object can have the following properties:

```jsx
{
  label: 'Button Text',     // Required: Button text
  icon: <FaIcon />,         // Optional: Button icon
  onClick: () => {},        // Required: Click handler
  variant: 'primary',       // Optional: Bootstrap variant
  disabled: false,          // Optional: Disable button
  className: 'custom-class' // Optional: Additional CSS class
}
```

## Examples for Different Use Cases

### Simple Data List

```jsx
<Table
  data={products}
  columns={[
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'category', label: 'Category' },
  ]}
  title='Products'
  searchable={true}
  exportable={true}
/>
```

### CRUD Interface

```jsx
<Table
  data={users}
  columns={userColumns}
  title='User Management'
  actions={crudActions}
  selectable={true}
  selectedItems={selected}
  onSelectionChange={setSelected}
  loading={isLoading}
/>
```

### Read-only Report

```jsx
<Table
  data={reportData}
  columns={reportColumns}
  title='Sales Report'
  searchable={true}
  exportable={true}
  exportFilename='sales_report'
  selectable={false}
  actions={[]}
/>
```

## Styling

The component uses Bootstrap classes and can be styled with CSS:

```css
.table-container {
  /* Custom container styles */
}

.table-primary {
  /* Header row styles */
}

.table-warning {
  /* Selected row styles */
}
```

## Tips

1. **Performance**: For large datasets, consider implementing server-side pagination
2. **Custom Rendering**: Use the `render` function for complex cell content
3. **Selection**: The selection indices are based on the filtered/sorted data
4. **CSV Export**: Only exports currently filtered data, not all data
5. **Search**: Searches across all columns using the render function output when available
