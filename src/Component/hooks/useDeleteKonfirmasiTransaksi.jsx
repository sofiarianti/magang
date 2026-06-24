import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi deleteKonfirmasiTransaksi, serta status loading dan error.
 */
const useDeleteKonfirmasiTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus data konfirmasi transaksi di backend.
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  const deleteKonfirmasiTransaksi = async (id) => {
    setLoading(true);
    setError(null);

    try {
      if (!endpoints.konfirmasi_transaksi || typeof endpoints.konfirmasi_transaksi.delete !== 'function') {
        throw new Error('endpoints.konfirmasi_transaksi.delete is not defined');
      }

      const response = await api.delete(endpoints.konfirmasi_transaksi.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 204) {
        return true;
      }

      setError('Gagal menghapus konfirmasi transaksi.');
      return false;
    } catch (err) {
      console.error('Error deleting konfirmasi transaksi:', err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Terjadi kesalahan saat menghapus konfirmasi transaksi.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteKonfirmasiTransaksi, loading, error };
};

export default useDeleteKonfirmasiTransaksi;
