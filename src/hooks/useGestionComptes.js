import { useState, useEffect } from 'react';
import { userApi } from '../api';
export const useGestionComptes = () => {
  const ROWS_PER_PAGE = 12;

  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowToUpdate, setRowToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  const emptyRowTemplate = {
    matricule: '',
    nom: '',
    prenom: '',
    tel: '',
    email: '',
    role: '',
    status: 'actif',
  };

  const [newRow, setNewRow] = useState({ ...emptyRowTemplate });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAll();
        setData(response.data.data || response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter data based on search text
  const filteredData = data.filter(user => {
    if (!filterText) return true;

    const searchText = filterText.toLowerCase();
    return (
      (user.matricule && user.matricule.toString().includes(searchText)) ||
      (user.nom && user.nom.toLowerCase().includes(searchText)) ||
      (user.prenom && user.prenom.toLowerCase().includes(searchText)) ||
      (user.tel && user.tel.includes(searchText)) ||
      (user.email && user.email.toLowerCase().includes(searchText)) ||
      (user.role && user.role.toLowerCase().includes(searchText)) ||
      (user.status && user.status.toLowerCase().includes(searchText))
    );
  });

  // Pagination calculations
  const indexOfLastRow = currentPage * ROWS_PER_PAGE;
  const indexOfFirstRow = indexOfLastRow - ROWS_PER_PAGE;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE) || 1;

  const paginate = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const generateEmail = (nom, prenom) => {
    const cleanNom = (nom || '').toLowerCase().trim();
    const cleanPrenom = (prenom || '').toLowerCase().trim();
    return cleanNom && cleanPrenom ? `${cleanNom}.${cleanPrenom}@cevital.com` : '';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedRow = { ...newRow, [name]: value };

    if (name === 'nom' || name === 'prenom') {
      updatedRow['email'] = generateEmail(
        name === 'prenom' ? value : newRow.prenom,
        name === 'nom' ? value : newRow.nom
      );
    }

    setNewRow(updatedRow);
  };

  const handleAddRow = async formData => {
    try {
      setLoading(true);

      const response = await userApi.register(formData);
      setData([...data, formData]);

      setCurrentPage(Math.ceil((data.length + 1) / ROWS_PER_PAGE));
      setShowForm(false);
      alert('Utilisateur ajouté avec succès.');
      return response;
    } catch (error) {
      console.error('Error adding user:', error);
      alert(error.response?.data?.message || "Erreur lors de l'ajout de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSave = async (id, fromData) => {
    try {
      setLoading(true);
      const response = await userApi.update(id, fromData);
      console.log(response);
      setData(data.map(user => (user.id_utilisateur === id ? fromData : user)));
      setShowUpdateModal(false);
      setSelectedRows([]);
      alert("L'utilisateur a été mis à jour avec succès !");
    } catch (error) {
      console.error('Error updating user:', error);
      alert(
        error.response?.data?.errors?.map(e => e.msg).join(', ') ||
          error.response?.data?.message ||
          'Erreur lors de la mise à jour.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;

    const usersToDelete = selectedRows.map(index => data[index]);
    const userIdsToDelete = usersToDelete.map(user => user.id_utilisateur);

    try {
      setLoading(true);
      await userApi.deleteMultiple(userIdsToDelete);
      setData(data.filter((_, index) => !selectedRows.includes(index)));
      setSelectedRows([]);
      alert('Utilisateurs supprimés avec succès !');
    } catch (error) {
      console.error('Error deleting users:', error);
      alert('Erreur lors de la suppression.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = index => {
    setSelectedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return {
    data,
    filteredData,
    currentRows,
    newRow,
    rowToUpdate,
    showForm,
    showUpdateModal,
    filterText,
    selectedRows,
    currentPage,
    totalPages,
    loading,
    emptyRowTemplate,
    setShowForm,
    setShowUpdateModal,
    setFilterText,
    setSelectedRows,
    setCurrentPage,
    setRowToUpdate,
    setNewRow,
    paginate,
    handleChange,
    handleAddRow,
    handleUpdateSave,
    handleDeleteSelected,
    handleCheckboxChange,
    generateEmail,
  };
};

export default useGestionComptes;
