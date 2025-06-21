import { useState, useEffect } from 'react';
import { trainingApi as formationApi } from '../api/training';
import { trainingNeedApi as trainingNeedApi } from '../api/trainingNeed';
import { locationApi } from '../api/location';
import { trainerApi } from '../api/trainer';

const emptyRowTemplate = {
  id: null,
  idbes: '',
  besoin_titre: '',
  besoin_objectif: '',
  direction_nom: '',
  id_direction: '',
  categorie: '',
  type: '',
  theme: '',
  date_debut: '',
  date_fin: '',
  idformateur: '',
  formateur_nom: '',
  lieu_libelle: '',
  etat: '',
};

export function useFormations() {
  const [formations, setFormations] = useState([]);
  const [besoins, setBesoins] = useState([]);
  const [organismes, setOrganismes] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newRow, setNewRow] = useState({ ...emptyRowTemplate });
  const [rowToUpdate, setRowToUpdate] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      formationApi.getAllWithDetails(),
      trainingNeedApi.getAll(),
      locationApi.getAll(),
      trainerApi.getAll(),
    ])
      .then(([formationsRes, besoinsRes, organismesRes, formateursRes]) => {
        console.log(formationsRes)
        setFormations(formationsRes.data || []);
        setBesoins(besoinsRes.data || []);
        setOrganismes(organismesRes.data || []);
        setFormateurs(formateursRes.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Add new formation
  const handleAddRow = async transformedData => {
    setLoading(true);
    try {
      await formationApi.create(transformedData);
      formationApi.getAllWithDetails().then(res => {
        setFormations(res.data);
      });
      setShowForm(false);
      setNewRow({ ...emptyRowTemplate });
    } catch (e) {
      console.error('Error adding formation:', e);
    } finally {
      setLoading(false);
    }
  };

  // Update formation
  const handleUpdateRow = async transformedData => {
    setLoading(true);
    console.log(transformedData)
    try {
      await formationApi.update(transformedData.id_formation, transformedData);
      formationApi.getAllWithDetails().then(res => {
        setFormations(res.data);
      });
      setShowUpdateModal(false);
      setRowToUpdate(null);
      setSelectedRows([]);
    } catch (e) {
      console.error('Error updating formation:', e);
    } finally {
      setLoading(false);
    }
  };

  // Delete selected formations
  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    setLoading(true);
    try {
      const ids = selectedRows.map(idx => formations[idx].id_formation);
      await Promise.all(ids.map(id => formationApi.delete(id)));
      setFormations(prev => prev.filter(f => !ids.includes(f.id_formation)));
      setSelectedRows([]);
    } catch (e) {
      // handle error
      console.error('Error deleting formations:', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for add form
  const handleChange = e => {
    const { name, value } = e.target;
    setNewRow(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for update form
  const handleUpdateChange = e => {
    const { name, value } = e.target;
    setRowToUpdate(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formations,
    besoins,
    organismes,
    formateurs,
    loading,
    error,
    selectedRows,
    setSelectedRows,
    showForm,
    setShowForm,
    showUpdateModal,
    setShowUpdateModal,
    newRow,
    setNewRow,
    rowToUpdate,
    setRowToUpdate,
    handleAddRow,
    handleUpdateRow,
    handleDeleteSelected,
    handleChange,
    handleUpdateChange,
    emptyRowTemplate,
  };
}

export default useFormations;
