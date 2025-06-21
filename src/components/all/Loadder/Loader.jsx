import React from 'react';
import './loader.css'; // We'll create this CSS file

function Loader() {
  return (
    <div className='loader-container'>
      <div className='loader-spinner'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
      <div className='loader-text'>Chargement en cours...</div>
    </div>
  );
}

export default Loader;
