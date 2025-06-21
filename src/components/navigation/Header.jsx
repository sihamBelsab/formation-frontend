import React from 'react';
import './header.css';
import Logo from '../all/logo';
import Search from '../all/Search';
import Nav from './Nav';
function Header({ userInfo, setUserInfo }) {
  return (
    <header
      id='header'
      className='header relative fixed-top d-flex align-items-center justify-content-between'
    >
      <Logo 
      />
      <Search />
      <Nav userInfo={userInfo} setUserInfo={setUserInfo} />
    </header>
  );
}

export default Header;
