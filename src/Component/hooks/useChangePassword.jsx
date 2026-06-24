import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * useChangePassword adalah custom hook yang digunakan untuk mengubah password donatur.
 * @returns { Object } - Mengembalikan fungsi changePassword, serta status loading dan error.
 */
const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fungsi untuk mengubah password donatur di backend.
   * @param { number|string } id - ID donatur yang sedang login.
   * @param { string } oldPassword - Password lama donatur.
   * @param { string } newPassword - Password baru donatur.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const changePassword = async (id, oldPassword, newPassword) => {
    setLoading(true);
    setError('');

    try {
      const data = {
        password: newPassword,
        old_password: oldPassword,
      };

      // Defensive check untuk memastikan endpoints terdefinisi
      if (!endpoints.donatur || typeof endpoints.donatur.update !== 'function') {
        throw new Error('endpoints.donatur.update is not defined');
      }

      // Mengirim PUT request ke endpoint update donatur
      const response = await api.put(endpoints.donatur.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Gagal mengubah kata sandi. Pastikan kata sandi lama benar.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
};

export default useChangePassword;
