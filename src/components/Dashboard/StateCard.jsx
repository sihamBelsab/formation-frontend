import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({
  icon,
  iconBg = '#2D499B',
  title,
  value,
  titleFontSize = '20px',
  cardHeight = '140px',
  valueMarginTop = '20px',
  iconSize = 16,
  iconBoxSize = 30,
}) => (
  <Card className='shadow-sm' style={{ borderRadius: '10px', height: cardHeight }}>
    <Card.Body className='d-flex align-items-start'>
      <div
        style={{
          width: `${iconBoxSize}px`,
          height: `${iconBoxSize}px`,
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          marginRight: '15px',
          marginTop: '10px',
        }}
      >
        {React.cloneElement(icon, { size: iconSize, color: 'white' })}
      </div>
      <div>
        <Card.Title
          style={{
            color: '#777777',
            fontSize: titleFontSize,
            fontFamily: 'Verdana, sans-serif',
            fontWeight: 'normal',
            paddingTop: '10px',
          }}
        >
          {title}
        </Card.Title>
        <Card.Text
          style={{
            color: 'black',
            fontSize: '25px',
            fontWeight: 'bold',
            marginTop: valueMarginTop,
            marginLeft: '20px',
          }}
        >
          {value}
        </Card.Text>
      </div>
    </Card.Body>
  </Card>
);

export default StatCard;
