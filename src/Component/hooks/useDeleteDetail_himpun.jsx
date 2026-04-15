// src/Component/hooks/useDeleteDetailHimpun.jsx
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 * useDeleteDetailHimpun adalah custom hook yang digunakan untuk menghapus data detail himpun dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteDetailHimpun, serta status loading dan error.
 */
const useDeleteDetailHimpun = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus detail himpun di backend.
   * @param { number } id - ID detail himpun yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteDetailHimpun = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.detail_himpun || typeof endpoints.detail_himpun.delete !== 'function') {
        throw new Error('endpoints.detail_himpun.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.detail_himpun.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus detail himpun.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting detail himpun:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Terjadi kesalahan saat menghapus detail himpun.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDetailHimpun, loading, error };
};

export default useDeleteDetailHimpun;