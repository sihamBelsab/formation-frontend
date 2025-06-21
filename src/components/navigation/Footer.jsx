import React from 'react';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-text">
            © {currentYear} Formation Management System. Tous droits réservés.
          </p>
        </div>
        <div className="footer-section">
          <p className="footer-text">
            Développé avec ❤️ pour la gestion des formations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 