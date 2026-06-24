import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

const buildRequestHeaders = (payload) => ({
  'Content-Type': payload instanceof FormData ? 'multipart/form-data' : 'application/json',
});

/**
 * @returns { Object } - Mengembalikan fungsi putKonfirmasiTransaksi, serta status loading dan error.
 */
const useUpdateKonfirmasiTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk memperbarui data konfirmasi transaksi di backend.
   * Dapat menerima object biasa atau FormData.
   * @param {number|string} id
   * @param {Object|FormData} payload
   * @returns {Promise<Object|null>}
   */
  const putKonfirmasiTransaksi = async (id, payload) => {
    setLoading(true);
    setError(null);

    try {
      if (!endpoints.konfirmasi_transaksi || typeof endpoints.konfirmasi_transaksi.update !== 'function') {
        throw new Error('endpoints.konfirmasi_transaksi.update is not defined');
      }

      const response = await api.put(endpoints.konfirmasi_transaksi.update(id), payload, {
        headers: buildRequestHeaders(payload),
      });

      return response.data;
    } catch (err) {
      console.error('Error updating konfirmasi transaksi:', err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Terjadi kesalahan saat memperbarui konfirmasi transaksi.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putKonfirmasiTransaksi, loading, error };
};

export default useUpdateKonfirmasiTransaksi;
