import React from 'react';
import Login from '../Component/Login';

function LoginPages({ onLogin, onGoToRegister, onGoToHome, onGuestAccess }) {
  return (
    <Login
      onLogin={onLogin}
      onGoToRegister={onGoToRegister}
      onGoToHome={onGoToHome}
      onGuestAccess={onGuestAccess}
    />
  );
}

export default LoginPages;
