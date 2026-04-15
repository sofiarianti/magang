import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * usePutUser adalah custom hook untuk memperbarui data user di backend.
 * @returns { Object } - Mengembalikan fungsi putUser, serta status loading dan error.
 */
const usePutUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memperbarui data user di backend.
   * @param { number } id - ID user yang akan diperbarui.
   * @param { string } kode_user - Kode user.
   * @param { string } nama_user - Nama user.
   * @param { string } kode_himpun - Kode himpun.
   * @param { string } email - Email user.
   * @param { string } password - Password user.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau null saat error.
   */
  const putUser = async (id, kode_user, nama_user, kode_himpun, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = {
        kode_user,
        nama_user,
        kode_himpun,
        email,
        password,
      };

      if (!endpoints.users || typeof endpoints.users.update !== 'function') {
        throw new Error('endpoints.users.update is not defined');
      }

      const response = await api.put(endpoints.users.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui user.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putUser, loading, error };
};

export default usePutUser;
