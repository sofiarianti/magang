// src/Component/hooks/useDeleteImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser'; // Pastikan path ini benar

/**
 *useDeleteInfakTerikat adalah custom hook yang digunakan untuk menghapus data infak terikat dari backend.
 * @returns { Object } - Mengembalikan fungsi deleteInfakTerikat, serta status loading dan error.
 */
const useDeleteInfakTerikat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk menghapus infak terikat di backend.
   * * @param { number } id - ID detail donasi yang akan dihapus.
   * @returns { Promise<boolean> } - Mengembalikan true jika berhasil, false jika gagal.
   */
  const deleteInfakTerikat = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Memastikan endpoint delete terdefinisi
      if (!endpoints.infak_terikat || typeof endpoints.infak_terikat.delete !== 'function') {
        throw new Error('endpoints.infak_terikat.delete is not defined');
      }

      // Mengirim DELETE request ke endpoint yang sesuai
      const response = await api.delete(endpoints.infak_terikat.delete(id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan true jika penghapusan berhasil
      if (response.status === 200 || response.status === 204) {
        return true;
      } else {
        setError('Gagal menghapus infak terikat.');
        return false;
      }
    } catch (err) {
      console.error('Error deleting infak terikat:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat menghapus infak terikat.');
      return false;
    } finally {
      setLoading(false);
    }
  };

return { deleteInfakTerikat, loading, error };
};

export default useDeleteInfakTerikat;