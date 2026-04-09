// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointAdmin'; // Pastikan path ini benar

/**
 * useDeleteZakat adalah custom hook yang digunakan untuk menghapus data zakat dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteZakat, serta status loading dan error.
 */
const useDeleteZakat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus zakat di backend.
   * @param { number } id - ID gambar yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteZakat = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.zakat || typeof endpoints.zakat.delete !== 'function') {
        throw new Error('endpoints.zakat.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.zakat.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus zakat.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting zakat:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus zakat.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteZakat, loading, error };
};

export default useDeleteZakat;