import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin';

/**
 * @returns { Object } - Mengembalikan fungsi postUser, serta status loading dan error.
 */
const usePostUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data user ke backend.
   * @param { string } kode_user
   * @param { string } nama_user
   * @param { string } kode_himpun
   * @param { string } email
   * @param { string } password
   * @param { string } role
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau null saat error.
   */
  const postUser = async (kode_user, nama_user, kode_himpun, email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.users.create, {
        kode_user,
        nama_user,
        kode_himpun,
        email,
        password,
        role,
      });

      return response.data;
    } catch (err) {
      console.error('Error posting user:', err);
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memposting user.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postUser, loading, error };
};

export default usePostUser;
