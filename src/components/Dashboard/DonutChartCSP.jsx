import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Col } from 'react-bootstrap';

const COLORS = ['#2D499B', '#f5ff75', '#3693d1'];

const DonutChartCSP = ({ data, title }) => {
  return (
        <Card className='shadow-sm donut-chart-card' style={{ borderRadius: '10px', height: '450px' }}>
        <Card.Body>
          <Card.Title
            style={{
              color: 'black',
              fontSize: '18px',
              fontFamily: 'Verdana, sans-serif',
              fontWeight: 'normal',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            {title || 'Répartition des Employés par Grade'}
          </Card.Title>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '30px',
              marginTop: '10px',
              height: '350px',
            }}
          >
            {/* Donut Chart */}
            <div style={{ flex: '0 0 60%', height: '100%', minWidth: '250px' }}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    innerRadius='40%'
                    outerRadius='70%'
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend à droite du donut */}
            <div
              style={{
                flex: '0 0 35%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: '100%',
                paddingLeft: '10px',
              }}
            >
              {data && data.length > 0 ? data.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    width: '100%',
                  }}
                >
                  {/* Point coloré */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: '10px',
                      flexShrink: 0,
                    }}
                  />
                  <span 
                    style={{ 
                      fontSize: '13px',
                      lineHeight: '1.3',
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={entry.name}
                  >
                    {entry.name}
                  </span>
                </div>
              )) : (
                <div style={{ color: '#999', fontSize: '14px' }}>
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
  );
};

export default DonutChartCSP;
