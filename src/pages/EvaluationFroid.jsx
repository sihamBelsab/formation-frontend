import { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Row,
  Col,
  Container,
  Card,
  Badge,
  Spinner,
  ListGroup,
  Alert,
  Modal,
} from 'react-bootstrap';
import {
  FaChalkboardTeacher,
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaStar,
  FaPaperPlane,
  FaRegLightbulb,
  FaRegComments,
  FaEye,
} from 'react-icons/fa';
import Table from '../components/common/Table';

function EvaluationFroid({ userInfo }) {
  // ========== CONFIGURATION ==========
  const primaryColor = '#3a7ca5';
  const secondaryColor = '#2f6690';
  const lightBg = '#f8f9fa';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const API_BASE_URL = `${API_URL}/evaluation-froid`;

  // ========== STATE ==========
  const [formData, setFormData] = useState({
    intitule: '',
    dateRealisation: '',
    categorie: '',
    direction: '',
    matricule: '',
    nom: '',
    prenom: '',
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    date_evaluation: new Date().toISOString().split('T')[0],
    service: '',
    commentaire: '',
  });

  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [ratings, setRatings] = useState(Array(5).fill(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Questions for evaluation
  const questionsSatisfaction = [
    'La formation semblait-elle répondre aux besoins de votre collaborateur ?',
    'Votre collaborateur a-t-il pu mettre en pratique les connaissances acquises ?',
    'La formation a-t-elle permis une amélioration du savoir et savoir-faire de votre collaborateur ?',
    'La formation choisie a-t-elle permis un meilleur rendement de votre collaborateur ?',
    "L'impact de cette formation sur le comportement de votre collaborateur (savoir-être)",
  ];

  // ========== EFFECTS ==========
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/form-data`, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error("La réponse n'est pas au format JSON");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Erreur dans les données reçues');
        }

        setFormations(data.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/history`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('data', data);
        if (data.success) {
          setEvaluations(data.data);
        }
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setError(error.message || 'Failed to fetch evaluation history');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  // ========== HANDLERS ==========
  const handleFormationSelect = e => {
    const formationId = e.target.value;
    const formation = formations.find(f => f.id_formation == formationId);

    if (formation) {
      setSelectedFormation(formation);

      setFormData({
        ...formData,
        intitule: formation.besoin_titre,
        dateRealisation: formation.date_debut
          ? formation.date_debut.includes('T')
            ? formation.date_debut.split('T')[0]
            : formation.date_debut
          : '',
        categorie: formation.categorie,
        direction: formation.direction_nom,
      });

      if (formation.matricules && formation.participants) {
        const matricules = formation.matricules.split(',');
        const noms = formation.participants.split(',');

        const participantsList = matricules.map((matricule, index) => ({
          matricule: matricule.trim(),
          nomComplet: noms[index] ? noms[index].trim() : 'Inconnu',
        }));

        setParticipants(participantsList);
      } else {
        setParticipants([]);
      }
    } else {
      setParticipants([]);
      setSelectedParticipant(null);
    }
  };

  const handleParticipantSelect = participant => {
    setSelectedParticipant(participant);
    const [nom, ...prenomParts] = participant.nomComplet.split(' ');
    setFormData({
      ...formData,
      matricule: participant.matricule,
      nom: nom || '',
      prenom: prenomParts.join(' ') || '',
    });
    setShowParticipants(false);
  };

  const handleMatriculeChange = async e => {
    const matricule = e.target.value;
    setFormData({ ...formData, matricule });

    if (matricule.length >= 4) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/employe/${matricule}`);

        if (!response.ok) {
          throw new Error('Employé non trouvé');
        }

        const data = await response.json();

        if (data.success && data.data) {
          setFormData({
            ...formData,
            matricule,
            nom: data.data.nom || '',
            prenom: data.data.prenom || '',
          });
        } else {
          throw new Error(data.message || 'Aucun employé trouvé');
        }
      } catch (err) {
        console.error('Erreur recherche employé:', err);
        setError(`Aucun employé trouvé avec le matricule: ${matricule}`);
        setFormData({
          ...formData,
          nom: '',
          prenom: '',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStarClick = (rowIndex, starIndex) => {
    const newRatings = [...ratings];
    newRatings[rowIndex] = starIndex + 1;
    setRatings(newRatings);
  };

  const calculateAverage = () => {
    if (ratings.length === 0) return '0.00';
    const sum = ratings.reduce((a, b) => a + b, 0);
    return ((sum / ratings.length) * 20).toFixed(0);
  };

  const resetForm = () => {
    setFormData({
      intitule: '',
      dateRealisation: '',
      categorie: '',
      direction: '',
      matricule: '',
      nom: '',
      prenom: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      date_evaluation: new Date().toISOString().split('T')[0],
      service: '',
      commentaire: '',
    });
    setRatings(Array(5).fill(0));
    setSelectedFormation(null);
    setSelectedParticipant(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.matricule) {
        throw new Error('Le matricule du participant est obligatoire');
      }

      if (!selectedFormation) {
        throw new Error('Veuillez sélectionner une formation');
      }

      if (ratings.some(rating => rating === 0)) {
        throw new Error('Veuillez compléter toutes les évaluations par étoiles');
      }

      // Get employee ID from matricule
      const employeResponse = await fetch(`${API_BASE_URL}/employe/${formData.matricule}`);
      const employeData = await employeResponse.json();

      if (!employeData.success || !employeData.data) {
        throw new Error('Employé non trouvé ou données invalides');
      }

      // Prepare data for submission
      const submissionData = {
        id_employe_evalue: employeData.data.data[0].id_employe,
        id_responsable_evaluateur: userInfo.id_utilisateur,
        note: parseFloat(calculateAverage()),
        question1: formData.question1,
        question2: formData.question2,
        question3: formData.question3,
        question4: formData.question4,
        date_evaluation: formData.date_evaluation,
        service: formData.service,
        commentaire: formData.commentaire,
        id_formation: selectedFormation.id_formation,
      };

      // Submit to backend
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Erreur lors de la soumission');
      }

      // Success
      setSuccess('Évaluation soumise avec succès!');

      // Reset form
      setFormData({
        intitule: '',
        dateRealisation: '',
        categorie: '',
        direction: '',
        matricule: '',
        nom: '',
        prenom: '',
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        date_evaluation: new Date().toISOString().split('T')[0],
        service: '',
        commentaire: '',
      });
      setRatings(Array(5).fill(0));
      setSelectedFormation(null);
      setSelectedParticipant(null);
      setParticipants([]);

      // Refresh evaluations list
      const evaluationsResponse = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const evaluationsData = await evaluationsResponse.json();
      if (evaluationsData.success) {
        setEvaluations(evaluationsData.data);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Helper component for section titles
  const sectionTitle = (icon, text) => (
    <div className='d-flex align-items-center mb-4'>
      <div className='icon-circle me-3' style={{ backgroundColor: primaryColor }}>
        {icon}
      </div>
      <h4 className='mb-0' style={{ color: secondaryColor }}>
        {text}
      </h4>
    </div>
  );

  // Table columns configuration
  const columns = [
    {
      key: 'employee_name',
      label: 'Employee Name',
      render: (value, row) => `${row.nom} ${row.prenom}`,
    },
    {
      key: 'matricule',
      label: 'Matricule',
      render: value => value,
    },
    {
      key: 'formation_titre',
      label: 'Formation',
      render: (value, row) => value || row.formation_theme || 'N/A',
    },
    {
      key: 'date_evaluation',
      label: 'Date',
      render: value => new Date(value).toLocaleDateString(),
    },
    {
      key: 'note',
      label: 'Note',
      render: value => `${value}%`,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <Button
          variant='info'
          size='sm'
          onClick={() => {
            setSelectedEvaluation(row);
            setShowDetailModal(true);
          }}
        >
          <FaEye className='me-1' />
          View Details
        </Button>
      ),
    },
  ];

  // Evaluation Detail Modal Component
  const EvaluationDetailModal = ({ show, onHide, evaluation }) => {
    if (!evaluation) return null;

    return (
      <Modal show={show} onHide={onHide} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Evaluation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <Col md={6}>
              <h6>Employee Information</h6>
              <p>
                <strong>Name:</strong> {evaluation.nom} {evaluation.prenom}
              </p>
              <p>
                <strong>Matricule:</strong> {evaluation.matricule}
              </p>
            </Col>
            <Col md={6}>
              <h6>Evaluation Information</h6>
              <p>
                <strong>Date:</strong> {new Date(evaluation.date_evaluation).toLocaleDateString()}
              </p>
              <p>
                <strong>Note:</strong> {evaluation.note}%
              </p>
              <p>
                <strong>Service:</strong> {evaluation.service}
              </p>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col>
              <h6>Formation Details</h6>
              <p>
                <strong>Formation:</strong>{' '}
                {evaluation.formation_titre || evaluation.formation_theme || 'N/A'}
              </p>
              <p>
                <strong>Date de début:</strong> {evaluation.formation_date_debut || 'N/A'}
              </p>
              <p>
                <strong>Date de fin:</strong> {evaluation.formation_date_fin || 'N/A'}
              </p>
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col>
              <h6>Questions</h6>
              <div className='mb-3'>
                <p>
                  <strong>Pourquoi le recours à cette formation ?</strong>
                </p>
                <p className='text-muted'>{evaluation.question1}</p>
              </div>
              <div className='mb-3'>
                <p>
                  <strong>Source du besoin</strong>
                </p>
                <p className='text-muted'>{evaluation.question2}</p>
              </div>
              <div className='mb-3'>
                <p>
                  <strong>Précisez</strong>
                </p>
                <p className='text-muted'>{evaluation.question3}</p>
              </div>
              <div className='mb-3'>
                <p>
                  <strong>Objectif pour le collaborateur</strong>
                </p>
                <p className='text-muted'>{evaluation.question4}</p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <h6>Additional Information</h6>
              <p>
                <strong>Comments:</strong>
              </p>
              <p className='text-muted'>{evaluation.commentaire}</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // ========== RENDER ==========
  return (
    <Container className='py-4' style={{ maxWidth: '1200px' }}>
      {/* Loading indicator */}
      {loading && (
        <div className='text-center my-4'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Chargement...</span>
          </Spinner>
        </div>
      )}

      {/* Error message */}
      {error && (
        <Alert variant='danger' onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* Success message */}
      {success && (
        <Alert variant='success' onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      {/* Evaluation History Table */}
      <Card className='mb-4 border-0 shadow-sm'>
        <Card.Header
          className='py-3'
          style={{
            backgroundColor: '#dce1e9',
            color: '#254a67',
          }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='mb-0'>Evaluations</h5>
            <Badge pill bg='light' text='dark' className='px-3 py-2'>
              <FaEye className='me-1' /> History
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Table
            data={evaluations}
            columns={columns}
            loading={loading}
            searchable={true}
            searchPlaceholder='Search evaluations...'
            emptyMessage='No evaluations found'
            loadingMessage='Loading evaluations...'
            hover={true}
            striped={true}
            responsive={true}
          />
        </Card.Body>
      </Card>

      {/* Main form card */}
      <Card className='border-0 shadow-sm'>
        <Card.Header
          className='py-4'
          style={{
            backgroundColor: '#dce1e9',
            color: '#254a67',
            padding: '6px',
            borderRadius: '10px',
          }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h4 className='mb-1'>Fiche de Validation des Acquis Professionnels</h4>
              <p className='mb-0 opacity-75'>
                Évaluation différée - à remplir après période d'application terrain
              </p>
            </div>
            {/* <Badge pill bg="light" text="dark" className="px-3 py-2">
              <FaPaperPlane className="me-1" /> Formulaire
            </Badge> */}
          </div>
        </Card.Header>

        <Card.Body className='p-4'>
          <Form onSubmit={handleSubmit}>
            {/* Section 1: Formation information */}
            {sectionTitle(<FaChalkboardTeacher />, 'Informations sur la formation')}
            <Row className='g-3 mb-4'>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Intitulé de la formation</Form.Label>
                  <Form.Select
                    value={selectedFormation?.id_formation || ''}
                    onChange={handleFormationSelect}
                    className='modern-select'
                    required
                  >
                    <option value=''>Sélectionnez une formation</option>
                    {formations.map(formation => (
                      <option key={formation.id_formation} value={formation.id_formation}>
                        {formation.besoin_titre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date de réalisation</Form.Label>
                  <Form.Control
                    type='date'
                    value={formData.dateRealisation || ''}
                    className='modern-input'
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date de l'évaluation</Form.Label>
                  <Form.Control
                    type='date'
                    value={formData.date_evaluation}
                    className='modern-input'
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Catégorie de formation</Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.categorie}
                    className='modern-input'
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Section 2: Assignment */}
            {sectionTitle(<FaBuilding />, 'Affectation')}
            <Row className='g-3 mb-4'>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Direction</Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.direction || ''}
                    className='modern-input'
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Service</Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                    placeholder='Développement'
                    className='modern-input'
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Section 3: Participants and Manager */}
            <Row className='mb-4'>
              <Col md={6}>
                {sectionTitle(<FaUsers />, 'Participants')}
                <div className='modern-form-section'>
                  <Form.Group className='mb-3'>
                    <Form.Label>Matricule</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='12345'
                      value={formData.matricule}
                      onChange={handleMatriculeChange}
                      onClick={() => setShowParticipants(!showParticipants)}
                      className='modern-input'
                      required
                    />
                  </Form.Group>

                  {showParticipants && participants.length > 0 && (
                    <ListGroup className='mb-3' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {participants.map((participant, index) => (
                        <ListGroup.Item
                          key={index}
                          action
                          onClick={() => handleParticipantSelect(participant)}
                          active={selectedParticipant?.matricule === participant.matricule}
                          style={{ cursor: 'pointer' }}
                        >
                          {participant.matricule} - {participant.nomComplet}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  <Form.Group className='mb-3'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type='text'
                      value={formData.nom}
                      className='modern-input'
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type='text'
                      value={formData.prenom}
                      className='modern-input'
                      readOnly
                    />
                  </Form.Group>
                </div>
              </Col>

              <Col md={6}>
                {sectionTitle(<FaUserTie />, 'Responsable hiérarchique')}
                <div className='modern-form-section'>
                  <Form.Group className='mb-3'>
                    <Form.Label>Matricule</Form.Label>
                    <Form.Control
                      type='text'
                      value={userInfo.matricule}
                      className='modern-input'
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type='text'
                      value={userInfo.nom}
                      className='modern-input'
                      disabled
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type='text'
                      value={userInfo.prenom}
                      className='modern-input'
                      disabled
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>

            {/* Section 4: Questionnaire */}
            {sectionTitle(<FaRegLightbulb />, 'Questionnaire')}
            <Card className='mb-4 border-0 bg-light'>
              <Card.Body>
                <Form.Group className='mb-4'>
                  <Form.Label>Pourquoi le recours à cette formation ?</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.question1}
                    onChange={e => setFormData({ ...formData, question1: e.target.value })}
                    className='modern-textarea'
                    placeholder='Expliquez brièvement les raisons'
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label>Source du besoin</Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.question2}
                    onChange={e => setFormData({ ...formData, question2: e.target.value })}
                    className='modern-input'
                    placeholder='Évaluation annuelle, demande personnelle...'
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label>Précisez</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.question3}
                    onChange={e => setFormData({ ...formData, question3: e.target.value })}
                    className='modern-textarea'
                    placeholder='Détails supplémentaires si nécessaire'
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Objectif pour le collaborateur</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.question4}
                    onChange={e => setFormData({ ...formData, question4: e.target.value })}
                    className='modern-textarea'
                    placeholder='Objectifs attendus de la formation'
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Section 5: Star ratings */}
            <div className='d-flex justify-content-between align-items-center mb-4'>
              {sectionTitle(<FaStar />, 'Acquis de formation')}
              <div className='note-moyenne-container'>
                <h4 className='mb-0' style={{ color: secondaryColor }}>
                  Note moyenne: {calculateAverage()}%
                </h4>
              </div>
            </div>
            <div className='table-responsive mb-4'>
              <table className='table table-hover align-middle'>
                <thead>
                  <tr style={{ backgroundColor: lightBg }}>
                    <th style={{ width: '70%', color: secondaryColor }}>Objectifs</th>
                    <th style={{ width: '30%', color: secondaryColor, textAlign: 'center' }}>
                      Satisfaction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questionsSatisfaction.map((question, index) => (
                    <tr key={index}>
                      <td>{question}</td>
                      <td className='text-center'>
                        <div className='d-flex justify-content-center'>
                          {[...Array(5)].map((_, starIndex) => (
                            <FaStar
                              key={starIndex}
                              onClick={() => handleStarClick(index, starIndex)}
                              className='star-rating'
                              style={{
                                color: starIndex < ratings[index] ? '#FFC107' : '#E0E0E0',
                                cursor: 'pointer',
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 6: Comments */}
            <Row className='g-4 mb-4'>
              <Col md={6}>
                <Card className='h-100 border-0 shadow-sm'>
                  <Card.Body>
                    <div className='d-flex align-items-center mb-3'>
                      <FaRegComments className='me-2' style={{ color: primaryColor }} />
                      <h5 style={{ color: secondaryColor }}>Commentaires</h5>
                    </div>
                    <Form.Control
                      as='textarea'
                      rows={5}
                      value={formData.commentaire}
                      onChange={e => setFormData({ ...formData, commentaire: e.target.value })}
                      className='modern-textarea'
                      placeholder="Suggestions d'améliorations..."
                      required
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Submission buttons */}
            <div className='d-flex justify-content-end gap-3 mt-4'>
              <Button
                variant='outline-secondary'
                className='px-4 py-2 rounded-pill'
                onClick={resetForm}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                variant='primary'
                type='submit'
                className='px-4 py-2 rounded-pill'
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as='span' size='sm' animation='border' role='status' />
                    <span className='ms-2'>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className='me-2' />
                    Soumettre l'évaluation
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Evaluation Detail Modal */}
      <EvaluationDetailModal
        show={showDetailModal}
        onHide={() => {
          setShowDetailModal(false);
          setSelectedEvaluation(null);
        }}
        evaluation={selectedEvaluation}
      />
    </Container>
  );
}

export default EvaluationFroid;
