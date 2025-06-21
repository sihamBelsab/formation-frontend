// src/api/apiPoste.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API_BASE_URL = `${API_URL}/postes`;

// Récupérer tous les postes
export const fetchPostes = async () => {
  const res = await fetch(API_BASE_URL);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors du chargement des postes');
  return data.data;
};

// Ajouter un poste
export const addPoste = async (poste, id_direction) => {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ poste, id_direction }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout du poste");
  return data.data;
};

// Modifier un poste
export const updatePoste = async (id, poste, id_direction) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ poste, id_direction }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour du poste');
  return data.data;
};

// Supprimer un poste
export const deletePoste = async id => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur lors de la suppression du poste');
  return data;
};
