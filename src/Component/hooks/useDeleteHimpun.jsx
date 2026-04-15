// src/Component/hooks/useDeleteHimpun.jsx
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 * useDeleteHimpun adalah custom hook yang digunakan untuk menghapus data himpun dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteHimpun, serta status loading dan error.
 */
const useDeleteHimpun = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus data himpun di backend.
   * @param { number } id - ID himpun yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteHimpun = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.himpun || typeof endpoints.himpun.delete !== 'function') {
        throw new Error('endpoints.himpun.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.himpun.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus data himpun.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting himpun:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Terjadi kesalahan saat menghapus data himpun.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteHimpun, loading, error };
};

export default useDeleteHimpun;