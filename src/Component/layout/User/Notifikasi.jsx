import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead, deleteNotification } from '../../Services/notifikasi';

function getKodeDonatur(user) {
  return user?.donatur?.kode_donatur || user?.kode_donatur || null;
}

function Notifikasi({ userType = 'donatur', user = null }) {
  const kodeDonatur = getKodeDonatur(user);
  const [notifications, setNotifications] = useState(getNotifications(userType, kodeDonatur));

  useEffect(() => {
    setNotifications(getNotifications(userType, kodeDonatur));
  }, [userType, kodeDonatur]);

  useEffect(() => {
    function handleNotificationsUpdated() {
      setNotifications(getNotifications(userType, kodeDonatur));
    }
    window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    };
  }, [userType, kodeDonatur]);

  const handleMarkAsRead = (id) => {
    markNotificationRead(id, userType, kodeDonatur);
    setNotifications(getNotifications(userType, kodeDonatur));
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  };

  const handleDelete = (id) => {
    deleteNotification(id, userType, kodeDonatur);
    setNotifications(getNotifications(userType, kodeDonatur));
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <main className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest font-semibold text-blue-700">
              Notifikasi
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-900">
              Pemberitahuan Terbaru
            </h1>
            <p className="text-blue-600">
              Kelola semua pemberitahuan tentang status transaksi dan informasi penting.
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-semibold">
              {unreadCount} baru
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-12 text-center">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-blue-600 text-lg font-medium">Tidak ada notifikasi</p>
            <p className="text-blue-500 text-sm mt-1">Semua notifikasi Anda sudah dihapus atau belum ada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`p-5 rounded-xl border-2 transition-all duration-200 flex items-start justify-between gap-4 group hover:shadow-md ${
                  note.read
                    ? 'border-blue-100 bg-white'
                    : 'border-blue-400 bg-gradient-to-r from-blue-50 to-white'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    note.read ? 'bg-blue-200' : 'bg-blue-500 animate-pulse'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <h2 className={`font-semibold text-base transition-colors ${
                      note.read ? 'text-blue-800' : 'text-blue-900'
                    }`}>
                      {note.title}
                    </h2>
                    <p className={`text-sm mt-1 ${
                      note.read ? 'text-blue-500' : 'text-blue-700'
                    }`}>
                      {note.message}
                    </p>
                    <span className={`text-xs mt-2 inline-block ${
                      note.read ? 'text-blue-400' : 'text-blue-600 font-medium'
                    }`}>
                      {note.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!note.read && (
                    <button
                      onClick={() => handleMarkAsRead(note.id)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors opacity-0 group-hover:opacity-100"
                      title="Tandai sebagai dibaca"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus notifikasi"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-semibold shadow-sm transition-colors"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Notifikasi;
