import React from 'react';
import Register from '../Component/Register';

function RegisterPages({ onGoToLogin, onRegisterLogin }) {
  return (
    <Register
      onSuccess={onGoToLogin}
      onGoToLogin={onGoToLogin}
      onRegisterLogin={onRegisterLogin}
    />
  );
}

export default RegisterPages;
