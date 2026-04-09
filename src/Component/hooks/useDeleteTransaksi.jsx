// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 * useDeleteTransaksi adalah custom hook yang digunakan untuk menghapus data transaksi dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteTransaksi, serta status loading dan error.
 */
const useDeleteTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus transaksi di backend.
   * @param { number } id - ID transaksi yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteTransaksi = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.transaksi || typeof endpoints.transaksi.delete !== 'function') {
        throw new Error('endpoints.transaksi.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.transaksi.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus transaksi.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting transaksi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus transaksi.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTransaksi, loading, error };
};

export default useDeleteTransaksi;