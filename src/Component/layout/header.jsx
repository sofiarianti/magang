import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotifications } from '../Services/notifikasi';

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

// Helper rekursif untuk mencari field tertentu di objek user/admin,
// sehingga bisa menangani variasi struktur respons backend.
function findFieldDeep(obj, fieldNames) {
  if (!obj || typeof obj !== 'object') return null;
  if (!Array.isArray(fieldNames)) fieldNames = [fieldNames];

  for (const key of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      return obj[key];
    }
  }

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const result = findFieldDeep(value, fieldNames);
      if (result) return result;
    }
  }

  return null;
}

function Header({ user, admin, onLogout, onToggleSidebar }) {
  const navigate = useNavigate();

  // Tentukan user type berdasarkan params yang diterima (user param bisa berisi donatur atau admin)
  const userType = admin ? 'admin' : (user?.admin_id ? 'admin' : 'donatur');
  const currentUser = admin || user;
  
  // Normalisasi data user/admin supaya kompatibel untuk donatur & admin
  const displayName =
    findFieldDeep(currentUser, ['nama_user', 'nama', 'name', 'username']) ||
    findFieldDeep(currentUser?.donatur, ['nama']) ||
    'User';

  const displayEmail =
    findFieldDeep(currentUser, ['email', 'email_user']) ||
    findFieldDeep(currentUser?.donatur, ['email']) ||
    'Email tidak tersedia';

  const displayPicture =
    findFieldDeep(currentUser, ['picture', 'avatar', 'photo', 'foto']) || null;
  const initials = getInitials(displayName);
  const kodeDonatur =
    findFieldDeep(currentUser, ['kode_donatur', 'kodeDonatur']) ||
    findFieldDeep(currentUser?.donatur, ['kode_donatur', 'kodeDonatur']) ||
    null;

  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  useEffect(() => {
    function updateCount() {
      const notifs = getNotifications(userType, kodeDonatur);
      setUnreadCount(notifs.filter(n => !n.read).length);
    }

    function handleNotificationsUpdated(event) {
      updateCount();

      const detail = event?.detail;
      if (detail?.action !== 'added') return;
      if (detail.userType !== userType) return;

      if (userType === 'donatur' && detail.audienceKey !== kodeDonatur) return;

      setToastNotification(detail.notification);
    }

    updateCount();
    // Listen to storage events (untuk perubahan dari tab/window lain)
    window.addEventListener('storage', updateCount);
    // Listen to custom event (untuk perubahan dari halaman yang sama secara real-time)
    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, [userType, kodeDonatur]);

  useEffect(() => {
    if (!toastNotification) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToastNotification(null);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [toastNotification]);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-white text-slate-800 shadow-sm border-b border-slate-100 z-40">
      <div className="h-full px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: brand + toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            aria-label="Toggle sidebar"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              MP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-800">
                MPZ DONATUR
              </span>
              <span className="text-[11px] text-slate-400">
                Dashboard Zakat, Infaq & Sedekah
              </span>
            </div>
          </div>
        </div>

        {/* Right: user info + logout */}
        <div className="flex items-center gap-4">
          {currentUser && (
            <button
              type="button"
              onClick={() => navigate('/notifikasi')}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
              aria-label="Notifikasi"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  d="M12 2a7 7 0 00-7 7v4.586l-.707.707A1 1 0 005 16h14a1 1 0 00.707-1.707L19 13.586V9a7 7 0 00-7-7zm0 18a3 3 0 003-3H9a3 3 0 003 3z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {currentUser && (
            <Link
              to="/profil"
              className="flex items-center gap-3 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
              {displayPicture ? (
                <img
                  src={displayPicture}
                  alt={displayName}
                  className="w-9 h-9 rounded-full border border-slate-200 shadow-sm object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold border border-blue-200 shadow-sm">
                  {initials}
                </div>
              )}
              <div className="flex flex-col text-right">
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                  {displayEmail}
                </span>
              </div>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 4v2m0-12a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Konfirmasi Logout</h3>
                <p className="text-sm text-slate-600 mt-1">Apakah Anda yakin ingin logout dari aplikasi?</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {toastNotification && (
        <div className="fixed right-4 top-20 z-[70] w-[calc(100vw-2rem)] max-w-sm">
          <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500" />
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 2a7 7 0 00-7 7v4.586l-.707.707A1 1 0 005 16h14a1 1 0 00.707-1.707L19 13.586V9a7 7 0 00-7-7zm0 18a3 3 0 003-3H9a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Notifikasi Baru</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">{toastNotification.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{toastNotification.message}</p>
                <button
                  type="button"
                  onClick={() => {
                    setToastNotification(null);
                    navigate('/notifikasi');
                  }}
                  className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Lihat notifikasi
                </button>
              </div>
              <button
                type="button"
                onClick={() => setToastNotification(null)}
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Tutup notifikasi"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
