import React from 'react';
import './Logo.scss';
import logo from './../assets/logo-name.svg';

const Logo = () => (
  <div className="logo">
    <img src={logo} alt="Summer school Logo" />
  </div>
);

export default Logo;
