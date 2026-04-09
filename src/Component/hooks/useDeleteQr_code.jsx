// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 * useDeleteQr_code adalah custom hook yang digunakan untuk menghapus data qr_code dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteQr_code, serta status loading dan error.
 */
const useDeleteQr_code = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus qr_code di backend.
   * @param { number } id - ID qr_code  yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteQr_code  = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.qrcode || typeof endpoints.qrcode.delete !== 'function') {
        throw new Error('endpoints.qrcode.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.qrcode.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus qr_code.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting qr_code:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus qr_code .');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteQr_code, loading, error };
};

export default useDeleteQr_code;