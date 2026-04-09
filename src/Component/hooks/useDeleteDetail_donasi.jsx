// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 *useDeleteDetailDonasi adalah custom hook yang digunakan untuk menghapus data detail donasi dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteDetailDonasi, serta status loading dan error.
 */
const useDeleteDetailDonasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus detail donasi di backend.
   * * @param { number } id - ID detail donasi yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteDetailDonasi = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.detail_donasi || typeof endpoints.detail_donasi.delete !== 'function') {
        throw new Error('endpoints.detail_donasi.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.detail_donasi.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus detail donasi.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting detail donasi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus detail donasi.');
      return false;
    } finally {
      setLoading(false);
    }
  };

return { deleteDetailDonasi, loading, error };
};

export default useDeleteDetailDonasi;