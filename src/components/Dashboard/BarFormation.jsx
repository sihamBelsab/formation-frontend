import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const BarFormation = ({ data, title }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '450px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        padding: '60px 20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        
      }}
    >
      <h6
        style={{
          color: 'black',
          fontSize: '18px',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 'normal',
          marginBottom: '20px',
          textAlign: 'left',
        }}
      >
        {title || 'Répartition des formations par catégorie'}
      </h6>

      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#f2f2f2' />

          {/* Définir l'axe X et Y avec des tailles de police réduites */}
          <XAxis
            dataKey='name'
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 13, fontWeight: 'normal', fill: '#333' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 14, fontWeight: 'normal', fill: '#333' }}
          />

          <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }} />

          {/* Dégradé sur les barres */}
          <defs>
            <linearGradient id='blue-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#2D499B' stopOpacity={1} />{' '}
              {/* Couleur de départ : #2D499B */}
              <stop offset='100%' stopColor='#36A2EB' stopOpacity={1} />{' '}
              {/* Couleur de fin : Bleu plus foncé */}
            </linearGradient>
          </defs>

          <Bar
            dataKey='value'
            fill='url(#blue-gradient)' // Utilisation du dégradé bleu
            barSize={80}
            radius={[10, 10, 0, 0]}
            label={{
              position: 'top',
              fill: '#333',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarFormation;
