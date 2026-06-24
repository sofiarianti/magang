import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotifications } from '../../Services/notifikasi';
import api from '../../Services/api';
import endpoints from '../../Services/endpointUser';

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function findFieldDeep(obj, fieldNames) {
  if (!obj || typeof obj !== 'object') return null;
  const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];

  for (const key of fields) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      return obj[key];
    }
  }

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const result = findFieldDeep(value, fields);
      if (result) return result;
    }
  }

  return null;
}

function getDonaturEntity(responseData) {
  return (
    responseData?.donatur ||
    responseData?.data?.donatur ||
    responseData?.result?.donatur ||
    responseData?.payload?.donatur ||
    responseData?.data ||
    responseData?.result ||
    responseData?.payload ||
    responseData
  );
}

function getLembagaNameFromDonatur(donatur) {
  return (
    findFieldDeep(donatur, ['nama_lembaga', 'namaLembaga']) ||
    donatur?.lembaga?.nama_lembaga ||
    donatur?.lembaga?.nama ||
    donatur?.lembaga?.name ||
    ''
  );
}

function getLembagaIdFromDonatur(donatur) {
  return (
    donatur?.id_lembaga ||
    donatur?.lembaga_id ||
    donatur?.idLembaga ||
    donatur?.lembaga?.id_lembaga ||
    donatur?.lembaga?.id ||
    donatur?.lembaga?._id ||
    findFieldDeep(donatur, ['id_lembaga', 'lembaga_id', 'idLembaga'])
  );
}

function getLembagaEntity(responseData) {
  return (
    responseData?.lembaga ||
    responseData?.data?.lembaga ||
    responseData?.result?.lembaga ||
    responseData?.payload?.lembaga ||
    responseData?.data ||
    responseData?.result ||
    responseData?.payload ||
    responseData
  );
}

function getLembagaName(lembaga) {
  return lembaga?.nama_lembaga || lembaga?.nama || lembaga?.name || '';
}

function HeaderUser({ user, onLogout, onToggleSidebar, onGuestLoginRequest }) {
  const navigate = useNavigate();
  const isGuest = Boolean(user?.isGuest);
  const displayName =
    findFieldDeep(user, ['nama_user', 'nama', 'name', 'username']) ||
    findFieldDeep(user?.donatur, ['nama']) ||
    'User';
  const displayEmail =
    findFieldDeep(user, ['email', 'email_user']) ||
    findFieldDeep(user?.donatur, ['email']) ||
    'Email tidak tersedia';
  const displayPicture = findFieldDeep(user, ['picture', 'avatar', 'photo', 'foto']) || null;
  const kodeDonatur =
    findFieldDeep(user, ['kode_donatur', 'kodeDonatur']) ||
    findFieldDeep(user?.donatur, ['kode_donatur', 'kodeDonatur']) ||
    null;
  const donaturId =
    user?.donatur?.id ||
    user?.donatur?.id_donatur ||
    user?.id ||
    user?.id_donatur ||
    findFieldDeep(user, ['id_donatur']) ||
    null;
  const initials = getInitials(displayName);
  const [lembagaName, setLembagaName] = useState('');
  const [lembagaLoading, setLembagaLoading] = useState(false);
  const lembagaLabel = lembagaLoading
    ? 'Memuat lembaga...'
    : lembagaName || '-';

  useEffect(() => {
    let isMounted = true;

    const loadLembagaByLoggedInDonatur = async () => {
      if (isGuest) {
        setLembagaName('');
        setLembagaLoading(false);
        return;
      }

      setLembagaLoading(true);

      try {
        let donatur = user?.donatur || user;

        if (donaturId) {
          try {
            const donaturResponse = await api.get(endpoints.donatur.getById(donaturId));
            donatur = getDonaturEntity(donaturResponse?.data) || donatur;
          } catch (err) {
            console.error('Failed to load donatur detail by id:', err);
          }
        }

        if (!getLembagaIdFromDonatur(donatur) && kodeDonatur) {
          try {
            const allDonaturResponse = await api.get(endpoints.donatur.getAll);
            const allDonaturData = getDonaturEntity(allDonaturResponse.data);
            const donaturList = Array.isArray(allDonaturData)
              ? allDonaturData
              : Array.isArray(allDonaturData?.donatur)
                ? allDonaturData.donatur
                : Array.isArray(allDonaturData?.data)
                  ? allDonaturData.data
                  : [];
            const matchedDonatur = donaturList.find((item) => (
              String(item?.kode_donatur || item?.kodeDonatur || '').trim() === String(kodeDonatur).trim()
            ));

            if (matchedDonatur) donatur = matchedDonatur;
          } catch (err) {
            console.error('Failed to find donatur by kode_donatur:', err);
          }
        }

        const directName = getLembagaNameFromDonatur(donatur);
        const idLembaga = getLembagaIdFromDonatur(donatur);

        if (!idLembaga) {
          if (directName && isMounted) setLembagaName(directName);
          if (!directName && isMounted) setLembagaName('');
          return;
        }

        let fetchedName = directName;

        try {
          const lembagaResponse = await api.get(endpoints.lembaga.getById(idLembaga));
          fetchedName = getLembagaName(getLembagaEntity(lembagaResponse.data));
        } catch (err) {
          console.error('Failed to load lembaga detail by id:', err);
        }

        if (!fetchedName) {
          const lembagaListResponse = await api.get(endpoints.lembaga.getAll);
          const lembagaData = getLembagaEntity(lembagaListResponse.data);
          const lembagaList = Array.isArray(lembagaData)
            ? lembagaData
            : Array.isArray(lembagaData?.lembaga)
              ? lembagaData.lembaga
              : Array.isArray(lembagaData?.data)
                ? lembagaData.data
                : [];
          const matchedLembaga = lembagaList.find((item) => (
            String(item?.id_lembaga || item?.id || item?._id || '').trim() === String(idLembaga).trim()
          ));

          fetchedName = getLembagaName(matchedLembaga);
        }

        if (isMounted) setLembagaName(fetchedName);
      } catch (err) {
        console.error('Failed to load lembaga name by logged in donatur:', err);
        if (isMounted) setLembagaName('');
      } finally {
        if (isMounted) setLembagaLoading(false);
      }
    };

    loadLembagaByLoggedInDonatur();

    return () => {
      isMounted = false;
    };
  }, [donaturId, isGuest, kodeDonatur, user]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  useEffect(() => {
    const updateCount = () => {
      const notifs = getNotifications('donatur', kodeDonatur);
      setUnreadCount(notifs.filter((notification) => !notification.read).length);
    };

    const handleNotificationsUpdated = (event) => {
      updateCount();

      const detail = event?.detail;
      if (detail?.action !== 'added') return;
      if (detail.userType !== 'donatur') return;
      if (detail.audienceKey !== kodeDonatur) return;

      setToastNotification(detail.notification);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, [kodeDonatur]);

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              MPZ
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-800">MPZ DT PEDULI</span>
              <span className="text-[11px] text-slate-400">Dashboard Zakat, Infaq & Sedekah</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isGuest && (
            <button
              type="button"
              onClick={() => navigate('/notifikasi')}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
              aria-label="Notifikasi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2a7 7 0 00-7 7v4.586l-.707.707A1 1 0 005 16h14a1 1 0 00.707-1.707L19 13.586V9a7 7 0 00-7-7zm0 18a3 3 0 003-3H9a3 3 0 003 3z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {!isGuest && (
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
                <span className="text-xs sm:text-sm font-medium text-slate-800">{displayName}</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[160px]">{displayEmail}</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[160px]">{lembagaLabel}</span>
              </div>
            </Link>
          )}

          {isGuest ? (
            <button
              type="button"
              onClick={onGuestLoginRequest}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition-colors"
            >
              Login / Registrasi
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
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
                x
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderUser;






