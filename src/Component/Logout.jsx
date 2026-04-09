import React from 'react';
import { googleLogout } from '@react-oauth/google';

function Logout({ onLogout }) {
  const handleLogout = () => {
    googleLogout();
    onLogout();
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;