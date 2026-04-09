// utils/notifikasi.js

// Helper untuk menentukan storage key berdasarkan user type
function getStorageKey(userType = 'donatur') {
  return userType === 'admin' ? 'admin_notifications' : 'donatur_notifications';
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

// Helper untuk menentukan user type dari localStorage
function getCurrentUserType() {
  const admin = localStorage.getItem('admin_user');
  return admin ? 'admin' : 'donatur';
}

function getCurrentDonaturKode() {
  const raw = localStorage.getItem('donatur_user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return (
      findFieldDeep(parsed, ['kode_donatur', 'kodeDonatur']) ||
      findFieldDeep(parsed?.donatur, ['kode_donatur', 'kodeDonatur']) ||
      null
    );
  } catch {
    return null;
  }
}

function normalizeAudienceKey(userType, audienceKey = null) {
  if (userType !== 'donatur') return null;
  return audienceKey || getCurrentDonaturKode() || null;
}

export function addNotification({ title, message, userType = null, audienceKey = null, kode_donatur = null }) {
  const type = userType || getCurrentUserType();
  const storageKey = getStorageKey(type);
  const notifications = getNotifications(type, null, { includeAllDonatur: true });
  const normalizedAudienceKey = normalizeAudienceKey(type, audienceKey || kode_donatur);
  const newNotif = {
    id: Date.now(),
    title,
    message,
    date: new Date().toISOString().split('T')[0],
    read: false,
    ...(type === 'donatur' ? { audienceKey: normalizedAudienceKey } : {}),
  };
  notifications.unshift(newNotif);
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent('notificationsUpdated', {
    detail: {
      action: 'added',
      userType: type,
      audienceKey: normalizedAudienceKey,
      notification: newNotif,
    },
  }));
}

export function getNotifications(userType = null, audienceKey = null, options = {}) {
  const type = userType || getCurrentUserType();
  const storageKey = getStorageKey(type);
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const notifications = JSON.parse(raw);

    if (type !== 'donatur') {
      return notifications;
    }

    if (options.includeAllDonatur) {
      return notifications;
    }

    const normalizedAudienceKey = normalizeAudienceKey(type, audienceKey);
    if (!normalizedAudienceKey) return [];

    return notifications.filter((note) => note.audienceKey === normalizedAudienceKey);
  } catch {
    return [];
  }
}

export function markAllNotificationsRead(userType = null, audienceKey = null) {
  const type = userType || getCurrentUserType();
  const storageKey = getStorageKey(type);
  const normalizedAudienceKey = normalizeAudienceKey(type, audienceKey);
  const notifications = getNotifications(type, null, { includeAllDonatur: true }).map((note) =>
    type === 'donatur' && normalizedAudienceKey
      ? (note.audienceKey === normalizedAudienceKey ? { ...note, read: true } : note)
      : { ...note, read: true }
  );
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
}

export function markNotificationRead(id, userType = null, audienceKey = null) {
  const type = userType || getCurrentUserType();
  const storageKey = getStorageKey(type);
  const normalizedAudienceKey = normalizeAudienceKey(type, audienceKey);
  const notifications = getNotifications(type, null, { includeAllDonatur: true }).map((note) => {
    if (type === 'donatur' && normalizedAudienceKey) {
      return note.id === id && note.audienceKey === normalizedAudienceKey
        ? { ...note, read: true }
        : note;
    }
    return note.id === id ? { ...note, read: true } : note;
  });
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
}

export function deleteNotification(id, userType = null, audienceKey = null) {
  const type = userType || getCurrentUserType();
  const storageKey = getStorageKey(type);
  const normalizedAudienceKey = normalizeAudienceKey(type, audienceKey);
  const notifications = getNotifications(type, null, { includeAllDonatur: true }).filter((note) => {
    if (type === 'donatur' && normalizedAudienceKey) {
      return !(note.id === id && note.audienceKey === normalizedAudienceKey);
    }
    return note.id !== id;
  });
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
}
