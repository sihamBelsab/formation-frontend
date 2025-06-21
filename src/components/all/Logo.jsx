import React, { useEffect } from 'react';
import './logo.css';

function Logo() {
  const handleToggleSideBar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };
  
  useEffect(() => {
    // Set sidebar closed by default on page load
    document.body.classList.add('toggle-sidebar');
  }, []);
  return (
    <div className='d-flex align-items-center justify-content-between'>
      <a href='/' className='logo d-flex align-items-center'>
        {/*<img src='' alt''/>*/}
       <span className="d-none d-lg-block" style={{ fontSize: '1.5rem', fontStyle: 'italic' }}>  Menu</span>
      </a>
      <i className='bi bi-text-indent-left toggle-icon ' onClick={handleToggleSideBar}>
        {/*pour le sidebar etre responsive*/}
      </i>
    </div>
  );
}

export default Logo;
