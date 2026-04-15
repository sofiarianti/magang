import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './Pages/Loginpages';
import RegisterPage from './Pages/RegisterPages';
import UserRoutes from './Component/layout/User/routesUser';
import AdminRoutes from './Component/layout/Admin/routesAdmin';

const createGuestUser = () => ({
  isGuest: true,
  isRegister: 0,
  nama: 'Guest Donatur',
  email: null,
});

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const publicView =
    location.pathname === '/login'
      ? 'login'
      : location.pathname === '/register'
        ? 'register'
        : 'home';

  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectToDashboard, setRedirectToDashboard] = useState(true);
  const isGuestUser = Boolean(user?.isGuest);

  const ensureGuestSession = () => {
    const guestUser = createGuestUser();
    setUser(guestUser);
    setAdmin(null);
    localStorage.setItem('guest_user', JSON.stringify(guestUser));
    return guestUser;
  };

  useEffect(() => {
    let parsedAdmin = null;
    let parsedUser = null;
    let parsedGuest = null;

    const savedAdmin = localStorage.getItem('admin_user');
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
        parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('donatur_user');
        localStorage.removeItem('donatur_credential');
      }
    }

    const savedGuest = localStorage.getItem('guest_user');
    if (savedGuest && !parsedAdmin && !parsedUser) {
      try {
        parsedGuest = JSON.parse(savedGuest);
        setUser(parsedGuest);
      } catch (e) {
        localStorage.removeItem('guest_user');
      }
    }

    if (!parsedAdmin && !parsedUser && !parsedGuest) {
      ensureGuestSession();
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading || !redirectToDashboard) return;
    if (!(user || admin)) return;

    const targetPath = '/';
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
    setRedirectToDashboard(false);
  }, [admin, isLoading, location.pathname, navigate, redirectToDashboard, user]);

  const handleLogin = (userData) => {
    setRedirectToDashboard(true);
    setUser(userData);
    setAdmin(null);
    localStorage.removeItem('guest_user');
  };

  const handleGuestAccess = () => {
    setRedirectToDashboard(true);
    ensureGuestSession();
  };

  const handleOpenAuth = () => {
    setRedirectToDashboard(false);
    navigate('/login');
  };

  const handleAdminLogin = (adminData) => {
    setRedirectToDashboard(true);
    setAdmin(adminData);
    setUser(null);
    localStorage.removeItem('guest_user');
  };

  const handleUserLogout = () => {
    localStorage.removeItem('donatur_user');
    localStorage.removeItem('donatur_credential');
    localStorage.removeItem('guest_user');
    ensureGuestSession();
    setRedirectToDashboard(true);
    navigate('/', { replace: true });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('guest_user');
    ensureGuestSession();
    setRedirectToDashboard(true);
    navigate('/', { replace: true });
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
      ) : publicView === 'login' && (!user || isGuestUser) ? (
        <LoginPage
          onLogin={handleLogin}
          onAdminLogin={handleAdminLogin}
          onGoToRegister={() => navigate('/register')}
          onGoToHome={() => navigate('/')}
          onGuestAccess={handleGuestAccess}
        />
      ) : publicView === 'register' && (!user || isGuestUser) ? (
        <RegisterPage
          onGoToLogin={() => navigate('/login')}
          onGoToHome={() => navigate('/')}
          onRegisterLogin={handleLogin}
        />
      ) : user ? (
        <UserRoutes
          user={user}
          onLogout={handleUserLogout}
          onGuestLoginRequest={handleOpenAuth}
        />
      ) : null}
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
