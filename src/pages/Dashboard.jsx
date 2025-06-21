import React from 'react';
import { Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUsers, FaBuilding, FaBook, FaClipboardList } from 'react-icons/fa';
import { LuRefreshCcw } from 'react-icons/lu';

import { useDashboard } from '../hooks';
import BarFormation from '../components/Dashboard/BarFormation';
import SatisfactionTable from '../components/Dashboard/SatisfactionTable';
import StatCard from '../components/Dashboard/StateCard';
import DonutChartCSP from '../components/Dashboard/DonutChartCSP';
import './Dashboard.css';
import { Navigate } from 'react-router-dom';

const statCards = [
  {
    icon: <FaBook />,
    title: 'Formations',
    valueKey: 'formations',
    titleFontSize: '1.1rem',
    valueMarginTop: '1.5rem',
    iconBoxSize: 28,
  },
  {
    icon: <FaUsers />,
    title: 'Employés',
    valueKey: 'employees',
    titleFontSize: '1rem',
    valueMarginTop: '0.8rem',
    iconBoxSize: 30,
  },
  {
    icon: <FaBuilding />,
    title: 'Lieux de Formation',
    valueKey: 'locations',
    titleFontSize: '0.95rem',
    valueMarginTop: '1rem',
    iconBoxSize: 30,
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Formateurs',
    valueKey: 'trainers',
    titleFontSize: '1.1rem',
    valueMarginTop: '1.5rem',
    iconBoxSize: 30,
  },
];

const additionalStats = [
  {
  icon: (
    <div 
      className="flex items-center justify-center rounded-md p-1.5"
      style={{
        backgroundColor: 'rgb(20, 52, 128)', // Bleu nuit
        width: '30px',
        height: '30px',
        borderRadius: '6px', // Arrondi des bords (équivalent à rounded-sm)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FaClipboardList size={16} color="white" /> {/* Icône blanche */}
    </div>
  ),
  title: 'Besoins de Formation',
  valueKey: 'trainingNeeds',
  titleFontSize: '1.20rem',
  valueMarginTop: '1rem',
  iconBoxSize: 30,
}, 
  {
  icon: (
    <div 
      className="flex items-center justify-center"
      style={{
        backgroundColor: 'rgb(20, 52, 128)', // Même bleu nuit
        width: '30px',
        height: '30px',
        borderRadius: '6px', // Arrondi identique
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FaBuilding size={16} color="white" /> {/* Icône blanche */}
    </div>
  ),
  title: 'Directions',
  valueKey: 'directions',
   titleFontSize: '1.20rem',
  valueMarginTop: '1rem',
  iconBoxSize: 30,
},
];

const Dashboard = ({ userInfo }) => {
  const {
    stats,
    employeeDistribution,
    formationsByCategory,
    evaluationSatisfaction,
    loading,
    error,
    refreshData,
  } = useDashboard();
  // Format data for charts
  const formationData = formationsByCategory.map(item => ({
    name: item.name,
    value: item.value,
  }));

  const employeesByGrade = employeeDistribution.map(item => ({
    name: item.name,
    value: item.value,
  }));
  // Format satisfaction data from evaluation chaud
  const satisfactionData = evaluationSatisfaction;

  if (loading) {
    return (
      <div className='container-fluid dashboard-container'>
        <div className='text-center mt-5'>
          <Spinner animation='border' variant='primary' size='lg' />
          <p className='mt-3'>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container-fluid dashboard-container'>
        <Alert variant='danger' className='mt-4' style={{ margin: '0 1rem' }}>
          <Alert.Heading>Erreur de chargement</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className='d-flex justify-content-end'>
            <button className='btn btn-outline-danger' onClick={refreshData}>
              <LuRefreshCcw className='me-2' />
              Réessayer
            </button>
          </div>
        </Alert>
      </div>
    );
  }
  console.log(userInfo);
  const allowedRoles = ['service_formation', 'directeur_rh', 'directeur_general', 'admin'];
  if (!allowedRoles.includes(userInfo.role)) {
    if (userInfo.role === 'employe') {
      return <Navigate to='/evaluation-chaud' />;
    }
    if (userInfo.role === 'responsable_direction') {
      return <Navigate to='/gestion-besoins' />;
    }
    return <Navigate to='/' />;
  }

  return (
    <div className='container-fluid dashboard-container'>
      {/* Header with refresh button */}
      <div className='dashboard-header'>
        <h2 style={{ color: '#0a2463', fontWeight: 600 }}>
          <i className='bi bi-speedometer2 me-2'></i>
          Tableau de Bord
        </h2>
        <button
          className='btn btn-outline-primary btn-sm'
          onClick={refreshData}
          disabled={loading}
          style={{
            borderColor: '#0a2463', // Bleu nuit
            color: '#0a2463', // Texte bleu nuit (optionnel)
          }}
        >
          <LuRefreshCcw className='me-2' />
        </button>
      </div>

      <Row className='my-4 dashboard-row'>
        {statCards.map(card => (
          <Col xl={3} lg={6} md={6} sm={12} key={card.title}>
            <StatCard
              icon={card.icon}
              title={card.title}
              value={stats[card.valueKey]?.toLocaleString()}
              titleFontSize={card.titleFontSize}
              valueMarginTop={card.valueMarginTop}
              iconBoxSize={card.iconBoxSize}
            />
          </Col>
        ))}
      </Row>

      <Row className=' dashboard-row mb-4'>
        {additionalStats.map(card => (
          <Col lg={6} md={12} className=' flex-column '>
            <Card className='shadow-sm dashboard-card' key={card.title}>
              <Card.Body className='d-flex align-items-start'>
                <div
                  className='dashboard-iconbox'
                  style={{
                    backgroundColor: card.iconBg,
                    width: card.iconBoxSize,
                    height: card.iconBoxSize,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <Card.Title
                    className='dashboard-card-title'
                    style={{ fontSize: card.titleFontSize }}
                  >
                    {card.title}
                  </Card.Title>
                  <Card.Text
                    className='dashboard-card-value'
                    style={{ marginTop: card.valueMarginTop }}
                  >
                    {stats[card.valueKey]?.toLocaleString()}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Section */}
      <Row className=' dashboard-row mb-4'>
        <Col lg={6} md={12}>
          {formationData.length > 0 ? (
            <BarFormation data={formationData} title='Répartition des formations par catégorie' />
          ) : (
            <Card className='p-4 text-center'>
              <p className='text-muted'>Aucune donnée de formation disponible</p>
            </Card>
          )}
        </Col>

        <Col lg={6} md={12}>
          <DonutChartCSP data={employeesByGrade} title='Répartition des Employés par Grade' />
        </Col>
      </Row>

      {/* Satisfaction Table */}
      {satisfactionData.length > 0 ? (
        <SatisfactionTable data={satisfactionData} title='Taux de Satisfaction des Formations' />
      ) : (
        <div className='dashboard-no-data'>
          <Card className='p-4 text-center'>
            <p className='text-muted'>Aucune évaluation de satisfaction disponible</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
