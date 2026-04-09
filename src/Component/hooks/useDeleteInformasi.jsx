// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin'; // Pastikan path ini benar

/**
 * useDeleteZakat adalah custom hook yang digunakan untuk menghapus data zakat dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteZakat, serta status loading dan error.
 */
const useDeleteInformasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus zakat di backend.
   * @param { number } id - ID gambar yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteInformasi = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.informasi || typeof endpoints.informasi.delete !== 'function') {
        throw new Error('endpoints.informasi.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.informasi.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus informasi.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting informasi:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus informasi.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteInformasi, loading, error };
};

export default useDeleteInformasi;