import React from 'react';
import Login from '../Component/Login';

function LoginPages({ onLogin, onAdminLogin, onGoToRegister, onGoToHome, onGuestAccess }) {
  return (
    <Login
      onLogin={onLogin}
      onAdminLogin={onAdminLogin}
      onGoToRegister={onGoToRegister}
      onGoToHome={onGoToHome}
      onGuestAccess={onGuestAccess}
    />
  );
}

export default LoginPages;
