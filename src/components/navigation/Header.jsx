import React from 'react';
import './header.css';
import Search from '../all/Search';
import Nav from './Nav';
import Logo from '../all/Logo';
function Header({ userInfo, setUserInfo }) {
  return (
    <header
      id='header'
      className='header relative fixed-top d-flex align-items-center justify-content-between'
    >
      <Logo />
      <Search />
      <Nav userInfo={userInfo} setUserInfo={setUserInfo} />
    </header>
  );
}

export default Header;
