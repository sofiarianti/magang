// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 *useDeleteInfakUmum adalah custom hook yang digunakan untuk menghapus data infak umum dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteInfakUmum, serta status loading dan error.
 */
const useDeleteInfakUmum = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
  * Fungsi untuk menghapus infak umum di backend.
   * * @param { number } id - ID detail donasi yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteInfakUmum = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.infak_umum || typeof endpoints.infak_umum.delete !== 'function') {
        throw new Error('endpoints.infak_umum.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.infak_umum.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus infak umum.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting infak umum:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus infak umum.');
      return false;
    } finally {
      setLoading(false);
    }
  };

return { deleteInfakUmum, loading, error };
};

export default useDeleteInfakUmum;