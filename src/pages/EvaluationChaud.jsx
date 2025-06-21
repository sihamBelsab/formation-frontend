import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, ProgressBar, Modal, Badge } from 'react-bootstrap';
import { FaStar, FaCheckCircle, FaUserTie, FaCalendarAlt, FaBuilding, FaChevronRight, FaInfoCircle, FaEye } from 'react-icons/fa';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './EvaluationChaud.css';
import { evaluationChaudApi } from '../api';
import { trainingApi } from '../api';
import Table from '../components/common/Table';

const questions = {
  "Objectifs, contenu et méthodologie": [
    "Les objectifs de la formation étaient clairs et précis",
    "Le contenu répondait bien à mes besoins",
    "Il y avait un bon équilibre entre la théorie et la pratique",
    "La documentation est de qualité et me sera utile",
    "Les méthodes et techniques utilisées ont facilité mon apprentissage"
  ],
  "Le formateur": [
    "Communiquait de façon claire",
    "A été attentif et a su s'adapter au groupe",
    "A favorisé les échanges et la participation du groupe",
    "A suscité mon intérêt à la session de la formation"
  ],
  "Organisation": [
    "La durée de la formation était suffisante",
    "Le local pédagogique était approprié",
    "Les moyens pédagogiques utilisés étaient de qualité"
  ],
  "Acquis et transfert des apprentissages": [
    "J'ai compris et intégré la majorité du contenu de la session",
    "Les connaissances acquises peuvent être directement appliquées dans mon travail"
  ],
  "Appréciation générale": [
    "De façon générale, je suis satisfait(e) de la formation reçue",
    "Je recommanderais à d'autres de suivre cette formation"
  ]
};

const EvaluationChaud = ({ userInfo }) => {
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formDetails, setFormDetails] = useState({
    formateur: '',
    organisme: ''
  });
  const [ratings, setRatings] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [userEvaluations, setUserEvaluations] = useState([]);
  const [previousEvaluation, setPreviousEvaluation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const sections = Object.entries(questions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formationsResponse, evaluationsResponse] = await Promise.all([
          trainingApi.getCompletedTrainings(),
          evaluationChaudApi.getEvaluationsByEmployee()
        ]);
        
        if (formationsResponse.status === 200) {
          setFormations(formationsResponse.data.data);
        }
        
        if (evaluationsResponse.success) {
          console.log('Evaluations data:', evaluationsResponse.data);
          // Transform the data to include formation details
          const evaluationsWithDetails = evaluationsResponse.data.map(evaluation => ({
            ...evaluation,
            theme: evaluation.formation?.theme || evaluation.theme,
            intitule: evaluation.formation?.intitule || evaluation.intitule,
            date_evaluation: evaluation.date_evaluation || evaluation.created_at,
            formateur_nom: evaluation.formation?.formateur_nom || evaluation.formateur_nom,
            lieu_libelle: evaluation.formation?.lieu_libelle || evaluation.lieu_libelle
          }));
          setUserEvaluations(evaluationsWithDetails);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleFormationSelect = (selected) => {
    setSelectedFormation(selected);
    if (selected && selected.length > 0) {
      const formation = selected[0];
      setFormDetails({
        formateur: formation.formateur_nom || '',
        organisme: formation.lieu_libelle || ''
      });

      // Check if user has already evaluated this formation
      const existingEvaluation = userEvaluations.find(
        evaluation => evaluation.id_formation === formation.id_formation
      );
      setPreviousEvaluation(existingEvaluation || null);
    } else {
      setFormDetails({
        formateur: '',
        organisme: ''
      });
      setPreviousEvaluation(null);
    }
  };

  const handleRatingChange = (question, value) => {
    setRatings(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const calculateAverage = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    // Convert to percentage (5 stars = 100%)
    return (average * 20).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFormation) {
      setError('Please select a formation');
      return;
    }

    // Check if user has already evaluated this formation
    const existingEvaluation = userEvaluations.find(
      evaluation => evaluation.id_formation === selectedFormation[0].id_formation
    );

    if (existingEvaluation) {
      setError('You have already evaluated this formation');
      return;
    }

    const averagePercentage = calculateAverage();
    setLoading(true);
    setError(null);

    try {
      await evaluationChaudApi.createEvaluation({
        id_formation: selectedFormation[0].id_formation,
        note: parseFloat(averagePercentage)
      });

      setSuccess(true);
      setRatings({});
      setSelectedFormation(null);
      alert('Evaluation soumise avec succès');
      window.location.reload();
    } catch (error) {
      setError(error.message || 'Error submitting evaluation');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (question, value) => {
    return (
      <div className="mb-3">
        <Form.Label>{question}</Form.Label>
        <div className="d-flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant={value >= star ? 'warning' : 'outline-warning'}
              onClick={() => handleRatingChange(question, star)}
              className="p-2"
            >
              <i className="bi bi-star-fill"></i>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderTypeahead = (label, field, options = [], placeholder = "", selected = [], onChange = () => {}) => (
    <Form.Group className="mb-4">
      <Form.Label className="form-label">{label}</Form.Label>
      <Typeahead
        id={`${field}-typeahead`}
        labelKey={(item) => item.besoin?.titre || item.theme || item.nom || item.intitule}
        options={options}
        placeholder={placeholder}
        selected={selected}
        onChange={onChange}
        className="modern-typeahead"
      />
    </Form.Group>
  );

  const renderTextInput = (label, name, placeholder = "", type = "text", icon = null, disabled = false, value = "") => (
    <Form.Group className="mb-4">
      <Form.Label className="form-label">{label}</Form.Label>
      <div className="input-with-icon">
        {icon && <span className="input-icon">{icon}</span>}
        <Form.Control
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          className="modern-input"
          disabled={disabled}
        />
      </div>
    </Form.Group>
  );

  const renderQuestionSection = () => {
    const [sectionTitle, questionsList] = sections[currentSection];
    const progress = ((currentSection + 1) / sections.length) * 100;

    return (
      <div className="question-section">
        <div className="section-header mb-4">
          <h4 className="section-title">{sectionTitle}</h4>
          <ProgressBar now={progress} className="section-progress" />
          <div className="progress-text">
            Étape {currentSection + 1} sur {sections.length}
          </div>
        </div>

        <div className="questions-grid">
          {questionsList.map((question, index) => (
            <Card key={index} className="question-card">
              <Card.Body>
                <h5 className="question-text">{question}</h5>
                {renderStarRating(question, ratings[question])}
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="navigation-buttons">
          {currentSection > 0 && (
            <Button variant="outline-primary" onClick={() => setCurrentSection(currentSection - 1)} className="nav-button">
              Précédent
            </Button>
          )}
          {currentSection < sections.length - 1 ? (
            <Button variant="primary" onClick={() => setCurrentSection(currentSection + 1)} className="nav-button next-button">
              Suivant <FaChevronRight />
            </Button>
          ) : (
            <Button variant="success" type="submit" className="nav-button submit-button" disabled={loading || !selectedFormation}>
              {loading ? 'Soumission...' : 'Soumettre l\'évaluation'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderPreviousEvaluation = () => {
    if (!previousEvaluation) return null;

    return (
      <Card className="mt-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">
            <FaInfoCircle className="me-2" />
            Évaluation précédente
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Note moyenne:</h6>
            <div className="evaluation-score">
              <span className="score-value">{previousEvaluation.note}%</span>
            </div>
          </div>
          <Alert variant="info" className="mb-0">
            Vous avez déjà évalué cette formation. Si vous souhaitez modifier votre évaluation, veuillez contacter l'administrateur.
          </Alert>
        </Card.Body>
      </Card>
    );
  };

  // Table columns configuration
  const columns = [
    { 
      key: 'formation', 
      label: 'Formation',
      render: (value, row) => row.theme || row.intitule || 'N/A'
    },

    { 
      key: 'note', 
      label: 'Note',
      render: (value) => `${value}%`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <Button
          variant="info"
          size="sm"
          onClick={() => {
            setSelectedEvaluation(row);
            setShowDetailModal(true);
          }}
        >
          <FaEye className="me-1" />
          View Details
        </Button>
      )
    }
  ];

  // Evaluation Detail Modal Component
  const EvaluationDetailModal = ({ show, onHide, evaluation }) => {
    if (!evaluation) return null;

    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Evaluation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <h6>Formation Information</h6>
              <p><strong>Formation:</strong> {evaluation.theme || 'N/A'}</p>
              <p><strong>Date:</strong> {evaluation.date_debut ? new Date(evaluation.date_debut).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Date de fin:</strong> {evaluation.date_fin ? new Date(evaluation.date_fin).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Lieu:</strong> {evaluation.lieu_libelle || 'N/A'}</p>
            </Col>
            <Col md={6}>
              <h6>Evaluation Details</h6>
              <p><strong>Note:</strong> {evaluation.note}%</p>
              <p><strong>Formateur:</strong> {evaluation.formateur_nom || 'N/A'}</p>
              <p><strong>Organisme:</strong> {evaluation.lieu_libelle || 'N/A'}</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container className="evaluation-container">
      {/* Evaluation History Table */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header 
          className="py-3" 
          style={{ 
            backgroundColor: '#dce1e9',
            color: '#254a67',
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0"> Evaluations</h5>
            <Badge pill bg="light" text="dark" className="px-3 py-2">
              <FaEye className="me-1" /> History
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Table
            data={userEvaluations}
            columns={columns}
            loading={loading}
            searchable={true}
            searchPlaceholder="Search evaluations..."
            emptyMessage="No evaluations found"
            loadingMessage="Loading evaluations..."
            hover={true}
            striped={true}
            responsive={true}
          />
        </Card.Body>
      </Card>

      <Card className="evaluation-card">
        <Card.Header className="evaluation-header">
          <h2 className="text-center mb-0">Évaluation Pédagogique – À Chaud</h2>
          <p className="text-center text-muted">Ce module permet de recueillir vos retours afin d’optimiser la pertinence et la qualité des formations proposées.</p>
        </Card.Header>
        
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Évaluation soumise avec succès!</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}>
                {renderTypeahead(
                  "Formation", 
                  "formation", 
                  formations, 
                  "Choisir une formation...", 
                  selectedFormation, 
                  handleFormationSelect
                )}
              </Col>
              <Col lg={6}>
                {renderTextInput(
                  "Nom et Prénom", 
                  "nomPrenom", 
                  `${userInfo.prenom} ${userInfo.nom}`,
                  "text",
                  <FaUserTie />,
                  true,
                  `${userInfo.prenom} ${userInfo.nom}`
                )}
              </Col>
            </Row>
            
            <Row>
              <Col lg={6}>
                {renderTextInput(
                  "Nom du Formateur", 
                  "formateur", 
                  "Nom du formateur",
                  "text",
                  <FaUserTie />,
                  true,
                  formDetails.formateur
                )}
              </Col>
              <Col lg={6}>
                {renderTextInput(
                  "Organisme de formation", 
                  "organisme", 
                  "Nom de l'organisme",
                  "text",
                  <FaBuilding />,
                  true,
                  formDetails.organisme
                )}
              </Col>
            </Row>

            {previousEvaluation ? (
              renderPreviousEvaluation()
            ) : (
              <>
                <div className="mb-4">
                  <h4>Note moyenne: {calculateAverage()}%</h4>
                </div>

                {/* Section des questions */}
                <Card className="questions-main-card mt-4">
                  <Card.Body>
                    {renderQuestionSection()}
                  </Card.Body>
                </Card>
              </>
            )}
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
};

export default EvaluationChaud;