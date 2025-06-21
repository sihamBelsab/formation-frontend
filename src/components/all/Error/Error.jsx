import React from 'react';
import { Link } from 'react-router-dom';
import './error.css'; // We'll create this CSS file

function Error({ message = "Une erreur s'est produite", showHomeLink = true }) {
  return (
    <div className='error-container'>
      <div className='error-content'>
        <div className='error-icon'>
          <i className='bi bi-exclamation-triangle-fill'></i>
        </div>
        <h3 className='error-title'>Erreur</h3>
        <p className='error-message'>{message}</p>
        {showHomeLink && (
          <Link to='/' className='btn btn-primary'>
            <i className='bi bi-house-door'></i> Retour à l'accueil
          </Link>
        )}
      </div>
    </div>
  );
}

export default Error;
