import React from 'react';
import './nav.css';
import NavNotice from './NavNotice';
import NavAvatar from './NavAvatar';
function Nav({ userInfo, setUserInfo }) {
  return (
    <nav className='header-nav ms-auto'>
      <ul className='d-flex align-items-center'>
        <NavNotice />
        <NavAvatar userInfo={userInfo} setUserInfo={setUserInfo} />
      </ul>
    </nav>
  );
}

export default Nav;
