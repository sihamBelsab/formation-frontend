import React from 'react';
import { Card } from 'react-bootstrap';

const SatisfactionTable = ({ data, title }) => {
  console.log(data);
  return (
    <div className="dashboard-row mt-4">
      <Card className="shadow-sm dashboard-card">
        <Card.Body style={{ padding: '1.5rem' }}>
          <h5
            style={{
              color: 'black',
              fontSize: '1.1rem',
              fontFamily: 'Verdana, sans-serif',
              fontWeight: 'normal',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            {title || 'Taux de Satisfaction'}
          </h5>
          {data.map((formation, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: '#777777',
                    flex: '1',
                    marginRight: '1rem',
                  }}
                >
                  {formation.nom}
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#4F73C2',
                    fontWeight: '600',
                    minWidth: '50px',
                    textAlign: 'right',
                  }}
                >
                  {formation.pourcentage}%
                </span>
              </div>
              {/* Barre de progression personnalisée */}
              <div
                style={{
                  height: '12px',
                  width: '100%',
                  backgroundColor: '#eee',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${formation.pourcentage}%`,
                    backgroundColor: getColor(formation.pourcentage),
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

// Appliquer tes 3 couleurs personnalisées
const getColor = value => {
  if (value >= 80) return '#2D499B';
  if (value >= 50) return '#3693d1';
  return '#f5ff75';
};

export default SatisfactionTable;
