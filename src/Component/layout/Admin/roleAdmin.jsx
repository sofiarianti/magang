const normalizeRoleValue = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

const mapRoleValue = (value) => {
  const normalized = normalizeRoleValue(value);

  if (['superadmin', 'adminutama', 'administrator', 'super'].includes(normalized)) {
    return 'super_admin';
  }

  if (['adminkeuangan', 'keuangan', 'finance', 'bendahara', 'fin'].includes(normalized)) {
    return 'admin_keuangan';
  }

  if (['adminprogram', 'program', 'adminoperasional', 'operasional', 'admin', 'user'].includes(normalized)) {
    return 'admin_program';
  }

  if (['customerservice', 'cs', 'pelanggan', 'layananpelanggan'].includes(normalized)) {
    return 'customer_service';
  }

  if (['pimpinan', 'owner', 'direktur', 'ketua'].includes(normalized)) {
    return 'pimpinan';
  }

  return normalized || 'admin_program';
};

const collectRoleCandidates = (admin) => {
  const sources = [
    admin,
    admin?.user,
    admin?.data,
    admin?.data?.user,
    admin?.data?.data,
    admin?.result,
    admin?.payload,
    Array.isArray(admin) ? admin[0] : null,
    Array.isArray(admin?.data) ? admin.data[0] : null,
    Array.isArray(admin?.users) ? admin.users[0] : null,
  ].filter(Boolean);

  const roleKeys = ['role', 'jabatan', 'posisi', 'level', 'user_role', 'nama_role'];
  const candidates = [];

  for (const source of sources) {
    for (const key of roleKeys) {
      if (source?.[key]) {
        candidates.push(source[key]);
      }
    }
  }

  return candidates;
};

export const resolveAdminRole = (admin) => {
  const candidates = collectRoleCandidates(admin);

  for (const candidate of candidates) {
    if (candidate) {
      return mapRoleValue(candidate);
    }
  }

  return 'admin_program';
};

export const isRoleAllowed = (role, allowedRoles = []) =>
  role === 'super_admin' || allowedRoles.length === 0 || allowedRoles.includes(role);
