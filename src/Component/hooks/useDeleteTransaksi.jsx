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
  const deleteTransaksi = async (idOrTransaction) => {
    setLoading(true);
    setError(null);

    const transactionId =
      idOrTransaction?.id ||
      idOrTransaction?.id_transaksi ||
      idOrTransaction;

    try {
      if (!transactionId && transactionId !== 0) {
        throw new Error('ID transaksi tidak valid untuk penghapusan.');
      }

      // Memastikan endpoint delete terdefinisi
      if (!endpoints.transaksi || typeof endpoints.transaksi.delete !== 'function') {
        throw new Error('endpoints.transaksi.delete is not defined');
      }

      const endpointPath = endpoints.transaksi.delete(transactionId);
      console.log('Deleting transaksi:', { transactionId, endpointPath });

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpointPath, {
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
      console.error('Error deleting transaksi:', {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
        responseData: err.response?.data,
      });
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Terjadi kesalahan saat menghapus transaksi.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTransaksi, loading, error };
};

export default useDeleteTransaksi;