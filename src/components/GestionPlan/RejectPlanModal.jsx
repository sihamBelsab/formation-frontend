import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const RejectPlanModal = ({
  show,
  onHide,
  plan,
  onReject,
  loading = false,
}) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onReject({ notes });
    if (result.success) {
      setNotes('');
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rejeter le Plan {plan?.annee}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Notes de Rejet</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Veuillez expliquer la raison du rejet..."
              required
            />
            <Form.Text className="text-muted">
              Ces notes seront visibles par le service de formation.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Annuler
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
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
                Rejet en cours...
              </>
            ) : (
              'Rejeter le Plan'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RejectPlanModal; 