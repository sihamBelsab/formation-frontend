import React, { useState } from 'react';
import Organismes from './Organismes';
import Formateurs from './Formateurs';
import Loader from '../components/all/Loadder/Loader';
import Error from '../components/all/Error/Error';
const Intervenants = ({ userInfo }) => {

  const [key, setKey] = useState('Organismes');
  const tabStyle = currentKey => ({
    backgroundColor: key === currentKey ? '#ffffff' :  '#e9ecef',
    color: key === currentKey ? '#2D499B' : '#6c757d',
    borderRadius: '15px 15px 0 0',
    padding: '10px 15px',
    fontWeight: 'bold',
    border: key === currentKey ? '2px solid #2D499B' : '1px solid #bbb',
    borderBottom: key === currentKey ? 'none' : '1px solid #bbb',
    cursor: 'pointer',

    // ✅ Ajout : largeur augmentée pour les titres d'onglet
    width: '450px', // Augmente la largeur des titres des onglets
    // ou si tu veux plus flexible :
    minWidth: '250px',
  });

  const allowedRoles = ["service_formation", "admin"];
  const allowedEditRoles = ['service_formation'];
  const allowedEdit = allowedEditRoles.includes(userInfo.role)
  if (!userInfo) {
    return <Loader/>;
  }
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return (
      <Error message="Vous n'avez pas accès à cette page" showHomeLink={true} />
    );
 }
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#ffffff', // fond blanc
        minHeight: '100vh', // pour que ça couvre tout l'écran
      }}
    >
      <h2 className='text-start mb-4' style={{ color: '#2D499B' }}>
        Intervenants Externes
      </h2>

      {/* Ajout d'un espace entre les onglets */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={tabStyle('Organismes')} onClick={() => setKey('Organismes')}>
          Lieux de formation
        </div>
        <div style={tabStyle('formateurs')} onClick={() => setKey('formateurs')}>
          Formateurs
        </div>
      </div>

      {/* Contenu de l'onglet sélectionné */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '0 0 5px 5px',
          border: '1px solid #bbb',
        }}
      >
        {key === 'Organismes' && <Organismes allowedEdit={allowedEdit}  />}
        {key === 'formateurs' && <Formateurs allowedEdit={allowedEdit} />}
      </div>
    </div>
  );
};

export default Intervenants;
