import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import SearchableSelect from '../common/SearchableSelect';
import { planApi } from '../../api/plan';

const AddFormationModal = ({
  show,
  onHide,
  plan,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    formationId: '',
    cout: '',
  });
  const [availableFormations, setAvailableFormations] = useState([]);
  const [formationsLoading, setFormationsLoading] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);

  // Fetch available formations
  useEffect(() => {
    const fetchAvailableFormations = async () => {
      if (show) {
        try {
          setFormationsLoading(true);
          const response = await planApi.get('/formations/available');
          const formations = response.data.data || response.data;
          setAvailableFormations(formations.map(formation => ({
            value: formation.id_formation,
            label: formation.theme,
            ...formation
          })));
        } catch (error) {
          console.error('Error fetching available formations:', error);
        } finally {
          setFormationsLoading(false);
        }
      }
    };

    fetchAvailableFormations();
  }, [show]);

  const handleFormationChange = (value) => {
    const selected = availableFormations.find(f => f.value === value);
    setSelectedFormation(selected);
    setFormData(prev => ({
      ...prev,
      formationId: value || ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.formationId || !formData.cout) {
      return;
    }

    const result = await onSave({
      formationId: formData.formationId,
      cout: formData.cout,
      dateDebut: selectedFormation.date_debut,
      dateFin: selectedFormation.date_fin,
      lieu: selectedFormation.lieu || '',
      formateur: selectedFormation.formateur || '',
      notes: selectedFormation.notes || ''
    });

    if (result.success) {
      setFormData({
        formationId: '',
        cout: '',
      });
      setSelectedFormation(null);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Formation au Plan {plan?.annee}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Formation</Form.Label>
            <SearchableSelect
              options={availableFormations}
              value={formData.formationId}
              onChange={handleFormationChange}
              placeholder="Rechercher une formation..."
              displayField="label"
              valueField="value"
              disabled={formationsLoading}
              noResultsText="Aucune formation disponible"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Budget (DA)</Form.Label>
            <Form.Control
              type="number"
              name="cout"
              value={formData.cout}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Entrez le budget"
              disabled={!selectedFormation}
            />
          </Form.Group>

          {selectedFormation && (
            <div className="mt-3">
              <h6>Détails de la Formation</h6>
              <p><strong>Dates:</strong> {new Date(selectedFormation.date_debut).toLocaleDateString()} - {new Date(selectedFormation.date_fin).toLocaleDateString()}</p>
              <p><strong>Type:</strong> {selectedFormation.type}</p>
              <p><strong>Catégorie:</strong> {selectedFormation.categorie}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !selectedFormation || !formData.cout}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Ajout en cours...
              </>
            ) : (
              'Ajouter'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddFormationModal;