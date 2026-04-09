import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './Pages/Loginpages';
import RegisterPage from './Pages/RegisterPages';
import UserRoutes from './Component/layout/User/routesUser';
import AdminRoutes from './Component/layout/Admin/routesAdmin';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState('login');
  const [redirectToDashboard, setRedirectToDashboard] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin_user');
    let parsedAdmin = null;

    if (savedAdmin) {
      try {
        parsedAdmin = JSON.parse(savedAdmin);
        setAdmin(parsedAdmin);
      } catch (e) {
        localStorage.removeItem('admin_user');
      }
    }

    const savedUser = localStorage.getItem('donatur_user');
    if (savedUser && !parsedAdmin) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('donatur_user');
        localStorage.removeItem('donatur_credential');
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading || !redirectToDashboard) return;
    if (!(user || admin)) return;
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
    setRedirectToDashboard(false);
  }, [admin, isLoading, location.pathname, navigate, redirectToDashboard, user]);

  const handleLogin = (userData) => {
    setRedirectToDashboard(true);
    setUser(userData);
    setAdmin(null);
  };

  const handleAdminLogin = (adminData) => {
    setRedirectToDashboard(true);
    setAdmin(adminData);
    setUser(null);
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem('donatur_user');
    localStorage.removeItem('donatur_credential');
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {admin ? (
        <AdminRoutes admin={admin} onLogout={handleAdminLogout} />
      ) : user ? (
        <UserRoutes user={user} onLogout={handleUserLogout} />
      ) : authView === 'login' ? (
        <LoginPage
          onLogin={handleLogin}
          onAdminLogin={handleAdminLogin}
          onGoToRegister={() => setAuthView('register')}
        />
      ) : (
        <RegisterPage
          onGoToLogin={() => setAuthView('login')}
          onRegisterLogin={handleLogin}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
