import React from 'react';
import Login from '../Component/Login';

function LoginPages({ onLogin, onAdminLogin, onGoToRegister }) {
  return (
    <Login
      onLogin={onLogin}
      onAdminLogin={onAdminLogin}
      onGoToRegister={onGoToRegister}
    />
  );
}

export default LoginPages;
